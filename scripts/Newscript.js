const { chromium } = require('playwright');
const config = require('../Config');
const Locators = require('../Data/Locators');
const Urls = require('../Data/URLs');

// ✅ Берём название из аргумента командной строки
const appName = process.argv[2];

if (!appName) {
  console.error('❌ Укажи название приложения при запуске:');
  console.error('Пример: node scripts/Newscript.js "Моё приложение"');
  process.exit(1);
}

(async () => {
  // 🔹 Запуск браузера с сохранённым профилем
  const context = await chromium.launchPersistentContext(
    config.PROFILE_PATH, // путь к твоему профилю
    {
      headless: config.HEADLESS,
      args: config.BROWSER_ARGS,
      viewport: config.VIEWPORT,
      ignoreDefaultArgs: config.IGNORE_DEFAULT_ARGS, // если используешь
    }
  );

  const page = await context.newPage();
  await page.goto(Urls.appList());
  await page.evaluate(() => document.body.style.zoom = "0.9");

  // 🔹 Создание приложения
  await page.waitForSelector(Locators.CREATE_APP_BUTTON, { state: 'visible' });
  await page.click(Locators.CREATE_APP_BUTTON);
  console.log('✅ Кнопка "Создать приложение" нажата');

  await page.waitForSelector(Locators.APP_NAME_INPUT, { state: 'visible' });
  await page.fill(Locators.APP_NAME_INPUT, appName);

  await page.click(Locators.LANGUAGE_DROPDOWN);
  await page.waitForSelector(Locators.RUSSIAN_LANGUAGE_OPTION);
  await page.click(Locators.RUSSIAN_LANGUAGE_OPTION);

  await page.click(Locators.APP_RADIO);
  await page.click(Locators.FREE_RADIO);
  await page.click(Locators.GUIDELINES_CHECKBOX);
  await page.click(Locators.EXPORT_LAWS_CHECKBOX);

  await page.waitForSelector(Locators.CREATE_APP_BUTTON, { state: 'visible' });
  await page.click(Locators.CREATE_APP_BUTTON);
  console.log('✅ Приложение создано');

  // 1. Переход в раздел "Рабочая версия" и выбор стран/регионов
  await page.waitForSelector(Locators.TESTING_RELEASE_BUTTON, { timeout: 60000 });
  await page.click(Locators.TESTING_RELEASE_BUTTON, { force: true });
  await page.waitForTimeout(500);

  const productionMenuItem = page.locator(Locators.PRODUCTION_MENU_ITEM);
  await productionMenuItem.waitFor({ state: 'visible' });
  await productionMenuItem.click();
  await page.waitForTimeout(500);

  await page.click(Locators.COUNTRIES_TAB);
  await page.waitForTimeout(500);

  await page.click(Locators.ADD_COUNTRIES_BUTTON);
  await page.waitForTimeout(500);

  const selectAllCheckbox = page.locator(Locators.SELECT_ALL_CHECKBOX);
  await selectAllCheckbox.waitFor({ state: 'visible' });
  await selectAllCheckbox.click();
  await page.waitForTimeout(500);

  await page.click(Locators.SAVE_BUTTON);
  await page.waitForTimeout(2000);
  console.log('✅ Страны/регионы выбраны и сохранены');
  await page.reload();


  // 2. Переход в раздел "Внутреннее тестирование" и выбор группы fitbase
  const testingMenuItem = page.locator(Locators.TESTING_MENU_ITEM);
  await testingMenuItem.waitFor({ state: 'visible' });
  await testingMenuItem.click({ force: true });
  await page.waitForTimeout(500);

  const internalTestingLink = page.locator(Locators.INTERNAL_TESTING_LINK);
  await internalTestingLink.waitFor({ state: 'visible' });
  await internalTestingLink.click();

  await page.click(Locators.TESTER_COUNT_TAB);
  await page.waitForTimeout(500);

  const fitbaseCheckbox = page.locator(Locators.FITBASE_CHECKBOX);
  await fitbaseCheckbox.waitFor({ state: 'visible' });
  await fitbaseCheckbox.click();
  await page.waitForTimeout(500);

  await page.click(Locators.SAVE_BUTTON1);
  await page.waitForTimeout(2000);
  console.log('✅ fitbase выбран и сохранён');
  await page.reload();


  // 3. Переход в "Настройки для Google Play"
  const acquisitionMenuItem = page.locator(Locators.ACQUISITION_MENU);
  await acquisitionMenuItem.waitFor({ state: 'visible' });
  await acquisitionMenuItem.click();
  await page.waitForTimeout(500);

  const appPageSection = page.locator(Locators.APP_PAGE_SECTION);
  await appPageSection.waitFor({ state: 'visible' });
  await appPageSection.click();
  await page.waitForTimeout(500);

  const storeSettingsLink = page.locator(Locators.STORE_SETTINGS_LINK);
  await storeSettingsLink.waitFor({ state: 'visible' });
  await storeSettingsLink.click();
  await page.waitForTimeout(500);

  console.log('✅ Перешли в "Настройки для Google Play"');

  // 4. Категории приложения
  const categoryEditButton = page.locator(Locators.CATEGORY_EDIT_BUTTON);

  await categoryEditButton.click();

  const categoryDropdown = page.locator(Locators.CATEGORY_DROPDOWN);
  await categoryDropdown.waitFor({ state: 'visible' });
  await categoryDropdown.click();
  await page.waitForTimeout(300);

  const categoryOption = page.locator(Locators.CATEGORY_HEALTH_FITNESS_OPTION);
  await categoryOption.waitFor({ state: 'visible' });
  await categoryOption.click();

  const saveCategoryButton = page.locator(Locators.CATEGORY_SAVE_BUTTON);
  await saveCategoryButton.waitFor({ state: 'visible' });
  await saveCategoryButton.click();
  await page.waitForTimeout(2000);

  const closeCategoryModal = page.locator(Locators.CATEGORY_CLOSE_BUTTON);
  await closeCategoryModal.waitFor({ state: 'visible' });
  await closeCategoryModal.click();
  console.log('✅ Категория приложения выбрана');
  await page.reload();


  // 5. Контактная информация
  const contactEditButton = page.locator(Locators.CONTACT_EDIT_BUTTON);
  await contactEditButton.waitFor({ state: 'visible' });
  await contactEditButton.click();

  const emailInput = page.locator(Locators.CONTACT_EMAIL_INPUT);
  await emailInput.waitFor({ state: 'visible' });
  await emailInput.fill('support@fitbase.io');

  const saveContactButton = page.locator(Locators.CONTACT_SAVE_BUTTON);
  await saveContactButton.waitFor({ state: 'visible' });
  await saveContactButton.click();
  await page.waitForTimeout(2000);

  const closeContactModal = page.locator(Locators.CONTACT_CLOSE_BUTTON);
  await closeContactModal.waitFor({ state: 'visible' });
  await closeContactModal.click();
  console.log('✅ Контактная информация заполнена');
  await page.reload();


   // 6. Переход в "Контент приложения"
  await page.locator(Locators.MONITORING_MENU).click();
  await page.waitForTimeout(500);

  const rulesMenuItem = page.locator(Locators.RULES_SECTION);
  await rulesMenuItem.waitFor({ state: 'visible' });
  await rulesMenuItem.click();
  await page.waitForTimeout(500);

  const contentItem = page.locator(Locators.CONTENT_POLICY_LINK);
  await contentItem.waitFor({ state: 'visible' });
  await contentItem.click();
  console.log('✅ Перешли в "Контент приложения"');

// 7. Заполнение декларации "Политика конфиденциальности"
const privacyDeclarationButton = page.locator(Locators.DECLARATION_PRIVACY_POLICY_BUTTON);
await privacyDeclarationButton.waitFor({ state: 'visible' });
await privacyDeclarationButton.click();

const privacyInput = page.locator(Locators.PRIVACY_POLICY_INPUT);
await privacyInput.waitFor({ state: 'visible' });
await privacyInput.fill('https://fitbase.io/privacy');

const saveButton = page.locator(Locators.SAVE_POLICY_BUTTON);
await saveButton.waitFor({ state: 'visible' });
await saveButton.click();
await page.waitForTimeout(2000);

const backButton = page.locator(Locators.BACK_TO_CONTENT_BUTTON);
await backButton.waitFor({ state: 'visible' });
await backButton.click();
await page.waitForTimeout(500);
console.log('✅ Декларация "Политика конфиденциальности" заполнена');

// 8. Заполнение декларации по рекламе
await page.locator(Locators.DECLARATION_ADS_BUTTON).click();
await page.waitForTimeout(500);

await page.locator(Locators.NO_ADS_RADIO).click();
await page.waitForTimeout(300);

await page.locator(Locators.SAVE_BUTTON).click();
await page.waitForTimeout(2000);

await page.locator(Locators.CONTENT_POLICY_LINK).click();
await page.waitForTimeout(500);
console.log('✅ Декларация "Реклама" заполнена');

// 8. Заполнение декларации Доступ к приложениям
await page.locator(Locators.DECLARATION_ACCESS_BUTTON).click();
await page.locator(Locators.ACCESS_LIMITED_RADIO).check();
await page.locator(Locators.ACCESS_ADD_INSTRUCTIONS_BUTTON).click();

await page.locator('div[role="group"][aria-label="Название инструкции"] input').fill('auth');
await page.locator('div[role="group"][aria-label="Имя пользователя и пароль"] input').nth(0).fill('+75555555555');
await page.fill(Locators.ACCESS_INSTRUCTIONS_PASSWORD_INPUT, '2626');
await page.click(Locators.ACCESS_INSTRUCTIONS_CHECKBOX);
await page.click(Locators.ACCESS_INSTRUCTIONS_ADD_BUTTON);

await page.locator(Locators.SAVE_BUTTON).click();
await page.waitForTimeout(2000);

await page.locator(Locators.CONTENT_POLICY_LINK).click();
await page.waitForTimeout(500);
console.log('✅ Декларация "Доступ к приложениям" заполнена');

// 9. Заполнение декларации Возрастные ограничения
await page.click(Locators.DECLARATION_AGE_RESTRICTION_BUTTON);
await page.click(Locators.AGE_FORM_START_BUTTON);

await page.fill(Locators.AGE_EMAIL_INPUT, 'support@fitbase.io');
await page.click(Locators.AGE_APP_CATEGORY_OTHER);
await page.click(Locators.AGE_CONSENT_CHECKBOX);
await page.click(Locators.AGE_NEXT_BUTTON);

// Отмечаем все ответы "Нет" на странице
let prevCount = 0;
let sameCountSteps = 0;
for (let scrollStep = 0; scrollStep < 20; scrollStep++) {
  const radios = await page.locator('role=radio[name="Нет"]').elementHandles();
  for (const radio of radios) {
    try {
      await radio.scrollIntoViewIfNeeded();
      await radio.click({ force: true });
      await page.waitForTimeout(800);
    } catch (e) {}
  }
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(800);

  // Считаем сколько уникальных radio появилось (можно по координатам или id)
  const count = radios.length;
  if (count === prevCount) {
    sameCountSteps++;
    if (sameCountSteps > 2) break; // Если 2 раза подряд одно и то же — выходим
  } else {
    sameCountSteps = 0;
    prevCount = count;
  }
}

await page.waitForTimeout(500);

await page.click(Locators.AGE_SAVE_BUTTON);
await page.waitForTimeout(500);
await page.click(Locators.AGE_NEXT_BUTTON);
await page.waitForTimeout(500);
await page.click(Locators.AGE_SAVE_BUTTON);
await page.waitForTimeout(1000);
await page.click(Locators.SIDEMENU_CONTENT);
await page.waitForTimeout(500);
console.log('✅ Декларация "Возрастные ограничения" заполнена');

// 10. Заполнение декларации Целевая аудитория и возрастные ограничения
await page.waitForSelector(Locators.AUDIENCE_DECLARATION_BUTTON, { state: 'visible' });
await page.click(Locators.AUDIENCE_DECLARATION_BUTTON);
await page.waitForTimeout(1000); 

await page.waitForSelector(Locators.AGE_18_CHECKBOX, { state: 'visible' });
await page.click(Locators.AGE_18_CHECKBOX);

await page.waitForSelector(Locators.AGE_NEXT_BUTTON, { state: 'visible' });
await page.click(Locators.AGE_NEXT_BUTTON1);
await page.waitForSelector(Locators.AGE_SAVE_BUTTON, { state: 'visible' });
await page.click(Locators.AGE_SAVE_BUTTON1);
await page.waitForTimeout(1000);
await page.locator(Locators.SIDEMENU_CONTENT).click();
await page.waitForTimeout(500);
console.log('✅ Декларация "Целевая аудитория и возрастные ограничения" заполнена');

// 11. Заполнение декларации Безопасность данных
await page.waitForSelector(Locators.DATA_SECURITY_DECLARATION_BUTTON, { state: 'visible' });
await page.click(Locators.DATA_SECURITY_DECLARATION_BUTTON);

await page.locator(Locators.IMPORT_CSV_BUTTON).click();
await page.waitForTimeout(500);

// Находим инпут для загрузки файла
const input = await page.locator('input[type="file"]');

// Подгружаем файл
await input.setInputFiles('./scripts/data_safety_export.csv'); 

await page.waitForSelector(Locators.SUCCESS_MESSAGE, { timeout: 10000 });
await page.click(Locators.IMPORT_BUTTON);
await page.waitForSelector(Locators.IMPORT_CONFIRM_BUTTON, { timeout: 10000 });
await page.click(Locators.IMPORT_CONFIRM_BUTTON);

await page.waitForSelector(Locators.NEXT_BUTTON, { state: 'visible', timeout: 15000 });
await page.click(Locators.NEXT_BUTTON);
await page.waitForSelector(Locators.NEXT_BUTTON, { state: 'visible', timeout: 15000 });
await page.click(Locators.NEXT_BUTTON);
await page.waitForSelector(Locators.NEXT_BUTTON, { state: 'visible', timeout: 15000 });
await page.click(Locators.NEXT_BUTTON);
await page.waitForSelector(Locators.FINAL_SAVE_BUTTON, { state: 'visible', timeout: 15000 });
await page.click(Locators.FINAL_SAVE_BUTTON);
await page.waitForTimeout(2000);
await page.locator(Locators.SIDEMENU_CONTENT).click();
await page.waitForTimeout(500);
console.log('✅ Декларация "Безопасность данных" заполнена');

// 12. Заполняем декларацию «Рекламный идентификатор»
await page.waitForSelector(Locators.AD_ID_DECLARATION_BUTTON, { state: 'visible' });
await page.click(Locators.AD_ID_DECLARATION_BUTTON);

await page.waitForSelector(Locators.AD_ID_RADIO_YES, { state: 'visible' });
await page.check(Locators.AD_ID_RADIO_YES);

await page.waitForSelector(Locators.ANALYTICS_CHECKBOX, { state: 'visible' });
await page.check(Locators.ANALYTICS_CHECKBOX);

await page.locator(Locators.SAVE_BUTTON).click();
await page.waitForTimeout(2000);

const contentLink = page.locator(Locators.SIDEMENU_CONTENT);
await contentLink.scrollIntoViewIfNeeded(); // прокручивает до момента, когда элемент станет видим
await contentLink.click();
await page.waitForTimeout(500);
console.log('✅ Декларация "Рекламный идентификатор" заполнена');

// 13. Заполняем декларацию «Приложение гос. учреждений»
await page.waitForSelector(Locators.GOV_APP_DECLARATION_BUTTON, { state: 'visible' });
await page.click(Locators.GOV_APP_DECLARATION_BUTTON);

await page.waitForSelector(Locators.GOV_APP_NO_RADIO, { state: 'visible' });
await page.check(Locators.GOV_APP_NO_RADIO);

await page.locator(Locators.SAVE_BUTTON).click();
await page.waitForTimeout(2000);

await page.locator(Locators.BACK_TO_CONTENT_LINK).click();
await page.waitForTimeout(500);
console.log('✅ Декларация "Приложение гос. учреждений" заполнена');

// 14. Заполняем декларацию «Финансовые функции»
await page.waitForSelector(Locators.FINANCE_DECLARATION_BUTTON, { state: 'visible' });
await page.click(Locators.FINANCE_DECLARATION_BUTTON);

await page.waitForSelector(Locators.NO_FINANCIAL_FUNCTIONS_CHECKBOX, { state: 'visible' });
await page.click(Locators.NO_FINANCIAL_FUNCTIONS_CHECKBOX);

await page.waitForSelector(Locators.FINANCE_NEXT_BUTTON, { state: 'visible' });
await page.click(Locators.FINANCE_NEXT_BUTTON);
await page.waitForTimeout(2000);

await page.locator(Locators.MAIN_SAVE_BUTTON).click();
await page.waitForTimeout(2000);

await page.locator(Locators.BACK_TO_CONTENT_LINK).click();
await page.waitForTimeout(500);
console.log('✅ Декларация "Финансовые функции" заполнена');

// 15. Заполняем декларацию «Приложения для здоровья»
await page.waitForSelector(Locators.HEALTH_DECLARATION_BUTTON, { state: 'visible' });
await page.click(Locators.HEALTH_DECLARATION_BUTTON);

await page.locator(Locators.HEALTH_FITNESS_CHECKBOX).check();

await page.locator(Locators.SAVE_BUTTON).click();
await page.waitForTimeout(2000);

await page.locator(Locators.BACK_TO_CONTENT_LINK).click();
await page.waitForTimeout(500);
console.log('✅ Декларация "Приложения для здоровья" заполнена');
console.log('✅ Приложение создано');

  await context.close();
})();