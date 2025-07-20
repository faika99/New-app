const path = require('path');

module.exports = {
    DEVELOPER_ID: '7569815859474021703',
    PRIVACY_POLICY_URL: 'https://fitbase.io/privacy/',
    PROFILE_PATH: path.resolve('/Users/macuser/Library/Application Support/Google/Chrome/Profile 1'),
    HEADLESS: false,
    VIEWPORT: { width: 2304, height: 1440 },
    BROWSER_ARGS: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-infobars',
        '--window-size=2304,1440'
    ],
    IGNORE_DEFAULT_ARGS: ['--enable-automation'],
    IGNORE_LOG_URLS: [
        'google-analytics.com/g/collect',
        'accountGroups:getAccountGroupStatus'
    ]
};