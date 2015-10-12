/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */
(function () {
    describe('AnonymousPiwikUsageMeasurementUrl', function() {
        var anonymousDomain = 'http://anonymous.piwikdomain.org';
        var trackingDomain = piwikUsageTracking.trackingDomain;

        var fakeLocation = {
            hash: "#?module=Dashboard&action=embeddedIndex&idSite=43&period=day&date=yesterday&idDashboard=25",
            host: "anonymous.piwikdomain.org",
            hostname: "anonymous.piwikdomain.org",
            href: anonymousDomain + "/index.php?module=CoreHome&action=index&idSite=43&period=day&date=yesterday#?module=Dashboard&action=embeddedIndex&idSite=43&period=day&date=yesterday&idDashboard=25",
            origin: anonymousDomain,
            pathname: "/index.php",
            search: "?module=CoreHome&action=index&idSite=43&period=day&date=yesterday"
        }

        describe('#makeUrlHierarchical', function() {
            it('should be an object', function() {
                expect(urlAnonymizer).to.be.an('object');
            });

            it('should make an url hierarchical', function() {
                var url = urlAnonymizer.makeUrlHierarchical(anonymousDomain + '/index.php?module=CoreHome&action=myAction&idSite=3&date=today&period=day')
                expect(url).to.eql(trackingDomain + '/corehome/myaction/?idSite=3&date=today&period=day');
            });

            it('should not make an url hierarchical if no module is given', function() {
                var url = urlAnonymizer.makeUrlHierarchical(anonymousDomain + '/index.php?idSite=3&date=today&period=day')
                expect(url).to.eql(trackingDomain + '/?idSite=3&date=today&period=day');
            });

            it('should use a default action when making url hierarchical', function() {
                var url = urlAnonymizer.makeUrlHierarchical(anonymousDomain + '/index.php?module=CoreHome&idSite=3&date=today&period=day')
                expect(url).to.eql(trackingDomain + '/corehome/default/?idSite=3&date=today&period=day');
            });
        });

        describe('#getAnonymizedUrl', function() {

            it('should anonymize url, hash given, should ignore search', function() {
                var url = urlAnonymizer.getAnonymizedUrl(fakeLocation);
                expect(url).to.eql(trackingDomain + "/index.php?module=Dashboard&action=embeddedIndex&idSite=3&period=day&date=yesterday&idDashboard=5");
            });

            it('should anonymize url, hash not given, should use search', function() {
                var testLocation = angular.copy(fakeLocation);
                testLocation.hash = "";
                var url = urlAnonymizer.getAnonymizedUrl(testLocation)
                expect(url).to.eql(trackingDomain + "/index.php?module=CoreHome&action=index&idSite=3&period=day&date=yesterday");
            });

            it('should anonymize url, hash and search not given', function() {
                var testLocation = angular.copy(fakeLocation);
                testLocation.hash = "";
                testLocation.search = "";
                var url = urlAnonymizer.getAnonymizedUrl(testLocation);
                expect(url).to.eql(trackingDomain+ "/index.php?");
            });

            it('should anonymize idGoal, idDashboard, tokenAuth, nonce, and all not whitelisted params', function() {
                var testLocation = angular.copy(fakeLocation);
                testLocation.hash += '&token_auth=c4ca4238a0b923820dcc509a6f75849b&nonce=d4ca4238a0b923820dcc509a6f75849b&pluginName=KeepThisOne&test=1&anyOther=4&idGoal=343&notallowed='

                var url = urlAnonymizer.getAnonymizedUrl(testLocation);
                expect(url).to.eql(trackingDomain + "/index.php?module=Dashboard&action=embeddedIndex&idSite=3&period=day&date=yesterday&idDashboard=5&token_auth=XYZ&nonce=XYZ&pluginName=KeepThisOne&test=XYZ&anyOther=XYZ&idGoal=3&notallowed=&notallowed=XYZ");
            });

            it('should anonymize popover', function() {
                var testLocation = angular.copy(fakeLocation);
                testLocation.hash = '#?popover=browsePluginDetail$3ABotTracker'

                var url = urlAnonymizer.getAnonymizedUrl(testLocation);
                expect(url).to.eql(trackingDomain + "/index.php?popover=browsePluginDetail");
            });

            it('should anonymize rowaction popover', function() {
                var testLocation = angular.copy(fakeLocation);
                testLocation.hash = "#?module=Dashboard&action=embeddedIndex&idSite=1&popover=RowAction$3ARowEvolution$3AActions.getPageUrls$3A$257B$257D$3Adocs"

                var url = urlAnonymizer.getAnonymizedUrl(testLocation);
                expect(url).to.eql(trackingDomain + "/index.php?module=Dashboard&action=embeddedIndex&idSite=1&popover=RowAction:RowEvolution");
            });

            describe('#getValueFromHashOrUrl', function() {

                it('should prefer value from hash when module is given in hash', function() {

                    var url = anonymousDomain + "/index.php?module=CoreHome&action=index&idSite=1&period=day&date=yesterday&activated=&mode=user#?module=Actions&action=menuGetPageUrls&idSite=1&period=day&date=yesterday&mode=user";

                    var value = urlAnonymizer.getValueFromHashOrUrl('module', url);
                    expect(value).to.eql("Actions");

                    value = urlAnonymizer.getValueFromHashOrUrl('action', url);
                    expect(value).to.eql("menuGetPageUrls");
                });

                it('should not read value from search when module is given in hash', function() {

                    var url = anonymousDomain + "/index.php?module=CoreHome&action=index&idSite=1&period=day&date=yesterday&activated=&mode=user#?module=Actions";

                    var value = urlAnonymizer.getValueFromHashOrUrl('module', url);
                    expect(value).to.eql("Actions");
                    value = urlAnonymizer.getValueFromHashOrUrl('action', url);
                    expect(value).to.eql("");
                    value = urlAnonymizer.getValueFromHashOrUrl('idSite', url);
                    expect(value).to.eql("");
                });

                it('should read value from search when no module is given in hash', function() {

                    var url = anonymousDomain + "/index.php?module=CoreHome&action=index&idSite=1&period=day&date=yesterday&activated=&mode=user#?action=menuGetPageUrls";

                    var value = urlAnonymizer.getValueFromHashOrUrl('module', url);
                    expect(value).to.eql("CoreHome");
                    value = urlAnonymizer.getValueFromHashOrUrl('action', url);
                    expect(value).to.eql("index");
                    value = urlAnonymizer.getValueFromHashOrUrl('idSite', url);
                    expect(value).to.eql("1");
                });
            });

            describe('#getPopoverNameFromUrl', function() {

                it('should read anonymized popover name from search', function() {
                    var url = anonymousDomain + "/index.php?test=search&popover=browsePluginDetail$3ABotTracker";

                    var popoverName = urlAnonymizer.getPopoverNameFromUrl(url);
                    expect(popoverName).to.eql("browsePluginDetail");
                });

                it('should read anonymized popover name from hash', function() {
                    var url = anonymousDomain + "/index.php?test=search#?module=CoreHome&popover=browsePluginDetail$3ABotTracker";

                    var popoverName = urlAnonymizer.getPopoverNameFromUrl(url);
                    expect(popoverName).to.eql("browsePluginDetail");
                });

                it('should read anonymized rowaction popover name from search', function() {
                    var url = anonymousDomain + "/index.php?test=search&popover=RowAction$3ATransitions$3Aurl$3Ahttp$3A$2F$2Fpiwik.org$2F";

                    var popoverName = urlAnonymizer.getPopoverNameFromUrl(url);
                    expect(popoverName).to.eql("RowAction:Transitions");
                });

                it('should read anonymized rowaction popover name from hash', function() {
                    var url = anonymousDomain + "/index.php?test=search#?module=CoreHome&popover=RowAction$3ATransitions$3Aurl$3Ahttp$3A$2F$2Fpiwik.org$2F";

                    var popoverName = urlAnonymizer.getPopoverNameFromUrl(url);
                    expect(popoverName).to.eql("RowAction:Transitions");
                });
            });
        });
    });
})();