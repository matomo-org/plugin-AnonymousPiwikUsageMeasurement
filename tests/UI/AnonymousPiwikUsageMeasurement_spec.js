/*!
 * Piwik - free/libre analytics platform
 *
 * Screenshot integration tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("AnonymousPiwikUsageMeasurement", function () {
    this.timeout(0);

    // uncomment this if you want to define a custom fixture to load before the test instead of the default one
    // this.fixture = "Piwik\\Plugins\\AnonymousPiwikUsageMeasurement\\tests\\Fixtures\\YOUR_FIXTURE_NAME";

    var generalParams = 'idSite=1&period=day&date=2010-01-03',
        urlBase = 'module=CoreHome&action=index&' + generalParams;

    before(function () {
        testEnvironment.pluginsToLoad = ['AnonymousPiwikUsageMeasurement'];
        testEnvironment.save();
    });

    it("should display the admin settings page", function (done) {
        var selector = '#AnonymousPiwikUsageMeasurement,#AnonymousPiwikUsageMeasurement+ .pluginIntroduction,#AnonymousPiwikUsageMeasurement + .pluginIntroduction + .adminTable'
            + ',#pluginSettings[piwik-plugin-name=AnonymousPiwikUsageMeasurement]';

        expect.screenshot('admin_settings_page').to.be.captureSelector(selector, function (page) {
            page.load("?module=CoreAdminHome&action=generalSettings&idSite=1&period=day&date=yesterday");
        }, done);
    });

    it("should display the user settings page", function (done) {
        var selector = '#AnonymousPiwikUsageMeasurement,#AnonymousPiwikUsageMeasurement+ .pluginIntroduction,#AnonymousPiwikUsageMeasurement + .pluginIntroduction + .adminTable'
            + ',#pluginSettings[piwik-plugin-name=AnonymousPiwikUsageMeasurement]';

        expect.screenshot('user_settings_page').to.be.captureSelector(selector, function (page) {
            page.load("?module=UsersManager&action=userSettings&idSite=1&period=day&date=yesterday");
        }, done);
    });

});