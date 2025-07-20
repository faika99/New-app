const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const config = require('../Config');
const FbAppId = require('../Arrays/FbAppId');
const Locators = require('../Data/Locators');
const Urls = require('../Data/Urls');

(async () => {
    const context = await chromium.launchPersistentContext(config.PROFILE_PATH, {
        headless: config.HEADLESS,
        viewport: config.VIEWPORT,
        args: config.BROWSER_ARGS,
        ignoreDefaultArgs: config.IGNORE_DEFAULT_ARGS,
    });

    const page = await context.newPage();
    await page.goto(Urls.appList());

    const appInternalIds = [];

    await page.waitForSelector(Locators.SEARCH_INPUT);

    for (const packageId of FbAppId) {
        console.log(`🔄 Обрабатываем App ID: ${packageId}`);

        await page.fill(Locators.SEARCH_INPUT, packageId);
        await page.waitForTimeout(2000);

        const foundAppSelector = Locators.FOUND_APP_ROW(packageId);
        const appExists = await page.$(foundAppSelector);
        if (!appExists) continue;

        const viewButtonSelector = Locators.VIEW_BUTTON(packageId);
        const viewButton = await page.$(viewButtonSelector);
        if (!viewButton) continue;

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            viewButton.click(),
        ]);

        const url = page.url();
        const match = url.match(/\/app\/(\d+)\/app-dashboard/);
        if (match) {
            const internalId = match[1];
            console.log(`❌ Внутренний ID приложения: ${internalId}`);
            appInternalIds.push(internalId);
        }

        await page.goto(Urls.appList());
        await page.fill(Locators.SEARCH_INPUT, '');
        await page.waitForTimeout(1000);
    }

    const appIdFilePath = path.resolve(__dirname, 'AppId.js');
    const fileContent = `module.exports = ${JSON.stringify(appInternalIds, null, 2)};\n`;
    fs.writeFileSync(appIdFilePath, fileContent, 'utf-8');

    await context.close();
})();
