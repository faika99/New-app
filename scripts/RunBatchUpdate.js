const { chromium } = require('playwright');
const path = require('path');

const config = require('../Config');
const selectors = require('../Data/Locators');
const messages = require('../Data/Messages');
const urls = require('../Data/URLS');

const APP_IDS = require('../Arrays/AppId');

(async () => {
  const context = await chromium.launchPersistentContext(config.PROFILE_PATH, {
    headless: config.HEADLESS,
    viewport: config.VIEWPORT,
    args: config.BROWSER_ARGS,
    ignoreDefaultArgs: config.IGNORE_DEFAULT_ARGS
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  const page = await context.newPage();

  page.on('response', async (response) => {
    const status = response.status();
    const url = response.url();
    const method = response.request().method();

    if (config.IGNORE_LOG_URLS.some(u => url.includes(u))) return;

    if (status >= 400 && ['POST', 'PATCH'].includes(method)) {
      const text = await response.text();
      console.error(`${messages.ERROR_REQUEST} ${method} ${url}: ${status} ${text}`);
    }
  });

  try {
    await page.goto(urls.appList());
    console.log(messages.OPENED_CONSOLE);

    for (const appId of APP_IDS) {
      console.log(`${messages.PROCESSING_APP} ${appId}`);

      await page.goto(urls.privacyPolicy(appId));

      try {
        await page.waitForSelector(selectors.PRIVACY_POLICY_INPUT, { timeout: 10000 });
        await page.fill(selectors.PRIVACY_POLICY_INPUT, config.PRIVACY_POLICY_URL);
      } catch {
        console.warn(`${messages.SKIPPED_PRIVACY_POLICY} ${appId}`);
        continue;
      }

      try {
        await Promise.race([
          page.waitForSelector(selectors.SAVE_BUTTON, { timeout: 10000 }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000)),
        ]);
        await page.click(selectors.SAVE_BUTTON);
        console.log(messages.CLICKED_SAVE);
        await page.waitForTimeout(3000);
      } catch {
        console.warn(`${messages.SKIPPED_SAVE} ${appId}`);
        continue;
      }

      await page.goto(urls.publishing(appId));

      try {
        await page.waitForSelector(selectors.SEND_FOR_REVIEW_BUTTON, { timeout: 10000 });
        await page.click(selectors.SEND_FOR_REVIEW_BUTTON);
        console.log(messages.CLICKED_SEND_FOR_REVIEW);

        await page.waitForSelector(selectors.CONFIRM_BUTTON, { timeout: 10000 });
        await page.click(selectors.CONFIRM_BUTTON);
        console.log(messages.CONFIRMED_SEND);
        await page.waitForTimeout(3000);
      } catch {
        console.warn(`${messages.SKIPPED_SEND_FOR_REVIEW} ${appId}`);
      }
    }

    console.log(messages.DONE);
  } catch {}

  await new Promise(() => {});
})();
