const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const context = await chromium.launchPersistentContext(
    '/Users/macuser/Library/Application Support/Google/Chrome/Profile 1',
    {
      headless: false,
      viewport: { width: 1600, height: 900 },
      args: ['--disable-blink-features=AutomationControlled']
    }
  );
  const page = await context.newPage();
  await page.goto('https://play.google.com/console/u/0/developers');
  console.log('✅ Войдите в аккаунт вручную.');
})();
