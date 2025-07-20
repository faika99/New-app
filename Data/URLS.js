const config = require('../Config');

module.exports = {
    appList: () =>
        `https://play.google.com/console/u/0/developers/${config.DEVELOPER_ID}/app-list`,

    privacyPolicy: (appId) =>
        `https://play.google.com/console/u/0/developers/${config.DEVELOPER_ID}/app/${appId}/app-content/privacy-policy`,

    publishing: (appId) =>
        `https://play.google.com/console/u/0/developers/${config.DEVELOPER_ID}/app/${appId}/publishing`,
};
