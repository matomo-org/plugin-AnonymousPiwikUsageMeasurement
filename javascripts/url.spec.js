/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */
(function () {
    describe('AnonymousPiwikUsageMeasurementUrl', function() {
        var anonymousDomain = 'http://anonymous.piwikdomain.org';
        var trackingDomain = piwikUsageTracking.trackingDomain;

        function buildUrl(search, hash)
        {
            return anonymousDomain + "/index.php" + search + hash;
        }

        var fakeSearch = "?module=CoreHome&action=index&idSite=43&period=day&date=yesterday";
        var fakeHash = "#?module=Dashboard&action=embeddedIndex&idSite=43&period=day&date=yesterday&idDashboard=25";
        var piwik3Hash = "#?idSite=1&period=day&date=yesterday&category=General_Actions&subcategory=Events_Events";

        var fakeUrl = buildUrl(fakeSearch, fakeHash);
        var piwik3Url = buildUrl(fakeSearch, piwik3Hash);

        describe('#makeUrlHierarchical', function() {
            var urlAnonymizer = new UrlAnonymizer('');

            it('should be a function', function() {
                expect(UrlAnonymizer).to.be.a('function');
            });

            it('should make an url hierarchical', function() {
                var url = urlAnonymizer.makeUrlHierarchical(anonymousDomain + '/index.php?module=CoreHome&action=myAction&idSite=3&date=today&period=day')
                expect(url).to.eql(trackingDomain + '/CoreHome/myAction/?idSite=3&date=today&period=day');
            });

            it('should not make an url hierarchical if no module is given', function() {
                var url = urlAnonymizer.makeUrlHierarchical(anonymousDomain + '/index.php?idSite=3&date=today&period=day')
                expect(url).to.eql(trackingDomain + '/?idSite=3&date=today&period=day');
            });

            it('should use a default action when making url hierarchical', function() {
                var url = urlAnonymizer.makeUrlHierarchical(anonymousDomain + '/index.php?module=CoreHome&idSite=3&date=today&period=day')
                expect(url).to.eql(trackingDomain + '/CoreHome/default/?idSite=3&date=today&period=day');
            });

            it('should correctly change a piwik 3 url', function() {
                var url = urlAnonymizer.makeUrlHierarchical(anonymousDomain + '/index.php?idSite=1&period=day#?idSite=1&period=day&date=yesterday&category=General_Actions&subcategory=Events_Events')
                expect(url).to.eql(trackingDomain + '/Actions/Events/?idSite=1&period=day');
            });

            it('should ignore sublevel id in case it is a number', function() {
                var url = urlAnonymizer.makeUrlHierarchical(anonymousDomain + '/index.php?idSite=1&period=day&date=yesterday&category=Dashboard_Dashboard&subcategory=5')
                expect(url).to.eql(trackingDomain + '/Dashboard/default/?idSite=1&period=day&date=yesterday');
            });
        });

        describe('#getAnonymizedUrl', function() {

            it('should anonymize url, hash given, should ignore search', function () {
                var urlAnonymizer = new UrlAnonymizer(fakeUrl);
                var url = urlAnonymizer.getAnonymizedUrl();
                expect(url).to.eql(trackingDomain + "/index.php?module=Dashboard&action=embeddedIndex&idSite=3&period=day&date=yesterday&idDashboard=5");
            });

            it('should anonymize url, hash not given, should use search', function () {
                var urlAnonymizer = new UrlAnonymizer(fakeSearch, "");
                var url = urlAnonymizer.getAnonymizedUrl();
                expect(url).to.eql(trackingDomain + "/index.php?module=CoreHome&action=index&idSite=3&period=day&date=yesterday");
            });

            it('should anonymize url, hash and search not given', function () {

                var urlAnonymizer = new UrlAnonymizer("", "");
                var url = urlAnonymizer.getAnonymizedUrl();
                expect(url).to.eql(trackingDomain + "/index.php?");
            });

            it('should anonymize idGoal, idDashboard, tokenAuth, nonce, and all not whitelisted params', function () {

                var hash = fakeHash + '&token_auth=c4ca4238a0b923820dcc509a6f75849b&nonce=d4ca4238a0b923820dcc509a6f75849b&pluginName=KeepThisOne&test=1&anyOther=4&idGoal=343&notallowed=';
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, hash));
                var url = urlAnonymizer.getAnonymizedUrl();

                expect(url).to.eql(trackingDomain + "/index.php?module=Dashboard&action=embeddedIndex&idSite=3&period=day&date=yesterday&idDashboard=5&token_auth=XYZ&nonce=XYZ&pluginName=KeepThisOne&test=XYZ&anyOther=XYZ&idGoal=3&notallowed=XYZ");
            });

            it('should anonymize popover', function () {

                var hash = '#?popover=browsePluginDetail$3ABotTracker';
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, hash));
                var url = urlAnonymizer.getAnonymizedUrl();
                expect(url).to.eql(trackingDomain + "/index.php?popover=browsePluginDetail");
            });

            it('should anonymize rowaction popover', function () {

                var hash = "#?module=Dashboard&action=embeddedIndex&idSite=1&popover=RowAction$3ARowEvolution$3AActions.getPageUrls$3A$257B$257D$3Adocs";
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, hash));
                var url = urlAnonymizer.getAnonymizedUrl();

                expect(url).to.eql(trackingDomain + "/index.php?module=Dashboard&action=embeddedIndex&idSite=1&popover=RowAction:RowEvolution");
            });
        });

        describe('#getBlacklistedUrlParams', function() {

            it('should anonymize url, hash given, should ignore search', function() {
                var urlAnonymizer = new UrlAnonymizer(fakeUrl);
                var url = urlAnonymizer.getBlacklistedUrlParams();
                expect(url).to.eql([]);
            });

            it('should anonymize url, hash not given, should use search', function() {
                var urlAnonymizer = new UrlAnonymizer(fakeSearch, "");
                var url = urlAnonymizer.getBlacklistedUrlParams();
                expect(url).to.eql([]);
            });

            it('should anonymize url, hash and search not given', function() {

                var urlAnonymizer = new UrlAnonymizer("", "");
                var url = urlAnonymizer.getBlacklistedUrlParams();
                expect(url).to.eql([]);
            });

            it('should find not whitelisted url params', function() {

                var search = fakeSearch + '&token_auth=c4ca4238a0b923820dcc509a6f75849b&nonce=d4ca4238a0b923820dcc509a6f75849b&pluginName=KeepThisOne&test=1&anyOther=4&idGoal=343&notallowed=';
                var urlAnonymizer = new UrlAnonymizer(buildUrl(search, fakeHash));
                var url = urlAnonymizer.getBlacklistedUrlParams();

                expect(url).to.eql(['token_auth', 'nonce', 'test', 'anyOther', 'notallowed']);
            });

            it('should not look in hash for url params', function() {

                var hash = fakeHash + '&token_auth=c4ca4238a0b923820dcc509a6f75849b&nonce=d4ca4238a0b923820dcc509a6f75849b&pluginName=KeepThisOne&test=1&anyOther=4&idGoal=343&notallowed=';
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, hash));
                var url = urlAnonymizer.getBlacklistedUrlParams();

                expect(url).to.eql([]);
            });

        });

        describe('#anonymizeIntegerValueInUrl', function() {
            var baseUrl = anonymousDomain + "/index.php?module=CoreHome&action=index&idSite=";

            it('should not change url parameter when anonymizing is not needed as it is lower than limit', function () {

                var urlAnonymizer = new UrlAnonymizer(baseUrl + "1");
                var value = urlAnonymizer.anonymizeIntegerValueInUrl('idSite');
                expect(value).to.eql(baseUrl + "1");

                urlAnonymizer = new UrlAnonymizer(baseUrl + "20");
                value = urlAnonymizer.anonymizeIntegerValueInUrl('idSite');
                expect(value).to.eql(baseUrl + "20");
            });

            it('should anonymize url parameter when integer is higher than limit', function () {

                var urlAnonymizer = new UrlAnonymizer(baseUrl + "21");
                var value = urlAnonymizer.anonymizeIntegerValueInUrl('idSite');
                expect(value).to.eql(baseUrl + "1");

                urlAnonymizer = new UrlAnonymizer(baseUrl + "23");
                value = urlAnonymizer.anonymizeIntegerValueInUrl('idSite');
                expect(value).to.eql(baseUrl + "3");

                urlAnonymizer = new UrlAnonymizer(baseUrl + "0");
                value = urlAnonymizer.anonymizeIntegerValueInUrl('idSite');
                expect(value).to.eql(baseUrl + "20");
            });

            it('should convert a text to NaN', function () {
                var urlAnonymizer = new UrlAnonymizer(baseUrl + "text");
                var value = urlAnonymizer.anonymizeIntegerValueInUrl('idSite');
                expect(value).to.eql(baseUrl + "NaN");
            });
        });

        describe('#getValueFromHashOrUrl', function() {

            it('should prefer value from hash when module is given in hash', function() {

                var url = anonymousDomain + "/index.php?module=CoreHome&action=index&idSite=1&period=day&date=yesterday&activated=&mode=user#?module=Actions&action=menuGetPageUrls&idSite=1&period=day&date=yesterday&mode=user";

                var urlAnonymizer = new UrlAnonymizer(url);
                var value = urlAnonymizer.getValueFromHashOrUrl('module');
                expect(value).to.eql("Actions");

                value = urlAnonymizer.getValueFromHashOrUrl('action');
                expect(value).to.eql("menuGetPageUrls");
            });

            it('should not read value from search when module is given in hash', function() {

                var url = anonymousDomain + "/index.php?module=CoreHome&action=index&idSite=1&period=day&date=yesterday&activated=&mode=user#?module=Actions";

                var urlAnonymizer = new UrlAnonymizer(url);
                var value = urlAnonymizer.getValueFromHashOrUrl('module');
                expect(value).to.eql("Actions");
                value = urlAnonymizer.getValueFromHashOrUrl('action');
                expect(value).to.eql("");
                value = urlAnonymizer.getValueFromHashOrUrl('idSite');
                expect(value).to.eql("");
            });

            it('should read value from search when no module is given in hash', function() {

                var url = anonymousDomain + "/index.php?module=CoreHome&action=index&idSite=1&period=day&date=yesterday&activated=&mode=user#?action=menuGetPageUrls";

                var urlAnonymizer = new UrlAnonymizer(url);
                var value = urlAnonymizer.getValueFromHashOrUrl('module');
                expect(value).to.eql("CoreHome");
                value = urlAnonymizer.getValueFromHashOrUrl('action');
                expect(value).to.eql("index");
                value = urlAnonymizer.getValueFromHashOrUrl('idSite');
                expect(value).to.eql("1");
            });
        });

        describe('#getPopoverNameFromUrl', function() {

            it('should read anonymized popover name from search', function() {
                var url = anonymousDomain + "/index.php?test=search&popover=browsePluginDetail$3ABotTracker";

                var urlAnonymizer = new UrlAnonymizer(url);
                var popoverName = urlAnonymizer.getPopoverNameFromUrl();
                expect(popoverName).to.eql("browsePluginDetail");
            });

            it('should read anonymized popover name from hash', function() {
                var url = anonymousDomain + "/index.php?test=search#?module=CoreHome&popover=browsePluginDetail$3ABotTracker";

                var urlAnonymizer = new UrlAnonymizer(url);
                var popoverName = urlAnonymizer.getPopoverNameFromUrl();
                expect(popoverName).to.eql("browsePluginDetail");
            });

            it('should read anonymized rowaction popover name from search', function() {
                var url = anonymousDomain + "/index.php?test=search&popover=RowAction$3ATransitions$3Aurl$3Ahttp$3A$2F$2Fpiwik.org$2F";

                var urlAnonymizer = new UrlAnonymizer(url);
                var popoverName = urlAnonymizer.getPopoverNameFromUrl();
                expect(popoverName).to.eql("RowAction:Transitions");
            });

            it('should read anonymized rowaction popover name from hash', function() {
                var url = anonymousDomain + "/index.php?test=search#?module=CoreHome&popover=RowAction$3ATransitions$3Aurl$3Ahttp$3A$2F$2Fpiwik.org$2F";

                var urlAnonymizer = new UrlAnonymizer(url);
                var popoverName = urlAnonymizer.getPopoverNameFromUrl();
                expect(popoverName).to.eql("RowAction:Transitions");
            });
        });

        describe('#anonymizePopoverName', function() {
            var baseUrl = anonymousDomain + "/index.php?test=search&popover=";

            it('should anonymized popover name', function() {

                var urlAnonymizer = new UrlAnonymizer(baseUrl + "browsePluginDetail$3ABotTracker");
                var popoverName = urlAnonymizer.anonymizePopoverName();
                expect(popoverName).to.eql(baseUrl + "browsePluginDetail");
            });

            it('should anonymize rowaction popover name', function() {

                var urlAnonymizer = new UrlAnonymizer(baseUrl + "RowAction$3ATransitions$3Aurl$3Ahttp$3A$2F$2Fpiwik.org$2F");
                var popoverName = urlAnonymizer.anonymizePopoverName();
                expect(popoverName).to.eql(baseUrl + "RowAction:Transitions");
            });

            it('should anonymize popover with hard coded value in case we cannot detect popover format to be sure it is anonymized', function() {
                var urlAnonymizer = new UrlAnonymizer(baseUrl);
                var popoverName = urlAnonymizer.anonymizePopoverName();
                expect(popoverName).to.eql(baseUrl + "XYZ");
            });

            it('should not anonymize anything when no popover param is given', function() {
                var urlAnonymizer = new UrlAnonymizer(anonymousDomain + "/index.php?test=search");
                var popoverName = urlAnonymizer.anonymizePopoverName();
                expect(popoverName).to.eql(anonymousDomain + "/index.php?test=search");
            });
        });

        describe('#anonymizeUrlParams', function() {
            var baseUrl = anonymousDomain + "/index.php?test=search&token_auth=";

            it('should not anonymize anything when no params given', function() {

                var urlAnonymizer = new UrlAnonymizer(baseUrl);
                var url = urlAnonymizer.anonymizeUrlParams([]);
                expect(url).to.eql(baseUrl);
            });

            it('should anonymize given url param', function() {

                var urlAnonymizer = new UrlAnonymizer(baseUrl + "123485689453453455fdf334");
                var url = urlAnonymizer.anonymizeUrlParams(['token_auth']);
                expect(url).to.eql(baseUrl + "XYZ");
            });

            it('should not anonymize anything when url parameter is not given', function() {

                var urlAnonymizer = new UrlAnonymizer(baseUrl);
                var url = urlAnonymizer.anonymizeUrlParams(['foobarnotexist']);
                expect(url).to.eql(baseUrl);
            });

            it('should anonymize when value is empty', function() {
                var urlAnonymizer = new UrlAnonymizer(baseUrl);
                var url = urlAnonymizer.anonymizeUrlParams(['token_auth']);
                expect(url).to.eql(baseUrl + "XYZ");
            });

            it('should be able to anonymize many url parameters', function() {
                var urlAnonymizer = new UrlAnonymizer(baseUrl + "123485689453453455fdf334");
                var url = urlAnonymizer.anonymizeUrlParams(['token_auth', 'test', 'foobarnotexist']);
                expect(url).to.eql(anonymousDomain + "/index.php?test=XYZ&token_auth=XYZ");
            });
        });

        describe('#getHashFromUrl', function() {

            it('should detect hash correctly', function() {
                var urlAnonymizer = new UrlAnonymizer(fakeUrl);
                var hash = urlAnonymizer.getHashFromUrl();
                expect(hash).to.eql(fakeHash);
            });

            it('should return empy string if contains search but no hash', function() {
                var urlAnonymizer = new UrlAnonymizer('http://example.org?query=foo');
                var hash = urlAnonymizer.getHashFromUrl();
                expect(hash).to.eql('');
            });

            it('should return empy string if url does not contain hash or query', function() {
                var urlAnonymizer = new UrlAnonymizer('http://example.org');
                var hash = urlAnonymizer.getHashFromUrl();
                expect(hash).to.eql('');
            });
        });

        describe('#getSearchFromUrl', function() {

            it('should detect search correctly', function() {
                var urlAnonymizer = new UrlAnonymizer(fakeUrl);
                var search = urlAnonymizer.getSearchFromUrl();
                expect(search).to.eql(fakeSearch.substr(1));
            });

            it('should return empy string if url does contain hash but no search', function() {
                var urlAnonymizer = new UrlAnonymizer('http://example.org#foo');
                var search = urlAnonymizer.getSearchFromUrl();
                expect(search).to.eql('');
            });

            it('should return empy string if url does not contain search', function() {
                var urlAnonymizer = new UrlAnonymizer('http://example.org');
                var search = urlAnonymizer.getSearchFromUrl();
                expect(search).to.eql('');
            });
        });

        describe('#isPiwik3ReportingUrl', function() {

            it('should not be if it contains module and action in hash but no category and subcategory', function() {
                var urlAnonymizer = new UrlAnonymizer(fakeUrl);
                var isPiwik3 = urlAnonymizer.isPiwik3ReportingUrl();
                expect(isPiwik3).to.be.false;
            });

            it('should not be if no hash is given', function() {
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, ""));
                var isPiwik3 = urlAnonymizer.isPiwik3ReportingUrl();
                expect(isPiwik3).to.be.false;
            });

            it('should be true in case it contains a category and subcategory', function() {
                var urlAnonymizer = new UrlAnonymizer(piwik3Url);
                var isPiwik3 = urlAnonymizer.isPiwik3ReportingUrl();
                expect(isPiwik3).to.be.true;
            });

            it('should be true in case category is zero', function() {
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, "#?idSite=1&period=day&date=yesterday&&category=0&subcategory=0"));
                var isPiwik3 = urlAnonymizer.isPiwik3ReportingUrl();
                expect(isPiwik3).to.be.true;
            });
        });

        describe('#getTopLevelId', function() {

            it('should detect id from Matomo 2 URL', function() {
                var urlAnonymizer = new UrlAnonymizer(fakeUrl);
                var id = urlAnonymizer.getTopLevelId();
                expect(id).to.eql('Dashboard');
            });

            it('should detect id from Matomo 2 URL and use module from search when hash does not contain module', function() {
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, ''));
                var id = urlAnonymizer.getTopLevelId();
                expect(id).to.eql('CoreHome');
            });

            it('should detect id from Matomo 3 URL', function() {
                var urlAnonymizer = new UrlAnonymizer(piwik3Url);
                var id = urlAnonymizer.getTopLevelId();
                expect(id).to.eql('Actions');
            });

            it('should detect top level id when category is zero', function() {
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, "#?idSite=1&period=day&date=yesterday&category=0&subcategory=0"));
                var id = urlAnonymizer.getTopLevelId();
                expect(id).to.eql('0');
            });

            it('should return empty string if it does not contan top level id', function() {
                var urlAnonymizer = new UrlAnonymizer("http://example.com");
                var id = urlAnonymizer.getTopLevelId();
                expect(id).to.eql('');
            });
        });

        describe('#getSubLevelId', function() {

            it('should detect id from Matomo 2 URL', function() {
                var urlAnonymizer = new UrlAnonymizer(fakeUrl);
                var id = urlAnonymizer.getSubLevelId();
                expect(id).to.eql('embeddedIndex');
            });

            it('should detect id from Matomo 2 URL and use module from search when hash does not contain module', function() {
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, ''));
                var id = urlAnonymizer.getSubLevelId();
                expect(id).to.eql('index');
            });

            it('should detect id from Matomo 3 URL', function() {
                var urlAnonymizer = new UrlAnonymizer(piwik3Url);
                var id = urlAnonymizer.getSubLevelId();
                expect(id).to.eql('Events');
            });

            it('should convert a number in subcategory to an empty string', function() {
                var urlAnonymizer = new UrlAnonymizer(buildUrl(fakeSearch, "#?idSite=1&period=day&date=yesterday&category=0&subcategory=0"));
                var id = urlAnonymizer.getSubLevelId();
                expect(id).to.eql('');
            });

            it('should return empty string if it does not contain top level id', function() {
                var urlAnonymizer = new UrlAnonymizer("http://example.com");
                var id = urlAnonymizer.getSubLevelId();
                expect(id).to.eql('');
            });
        });
    });
})();
