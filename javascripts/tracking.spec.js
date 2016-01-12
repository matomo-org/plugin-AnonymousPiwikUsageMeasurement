/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */
(function () {

    beforeEach(function() {
        "use strict";

        piwikUsageTracking.targets[0].useAnonymization = true;
        piwikUsageTracking.targets[1].useAnonymization = false;
        piwikUsageTracking.targets[2].useAnonymization = false;

        piwikUsageTracking.initialized = false;
        piwikUsageTracking.createTrackersIfNeeded();
    });


    describe('AnonymousPiwikUsageMeasurementUrl', function() {
        var anonymousDomain = 'http://anonymous.piwikdomain.org';
        var trackingDomain = piwikUsageTracking.trackingDomain;

        describe('#initialized', function() {
            it('should be initialized automatically', function() {
                expect(piwikUsageTracking.initialized).to.be.true;
                expect(piwikUsageTracking.trackers.length).to.eql(3);
            });

            it('should be initialized by createTrackers method if not initialized yet', function() {
                piwikUsageTracking.initialized = false;
                piwikUsageTracking.createTrackersIfNeeded();
                expect(piwikUsageTracking.initialized).to.be.true;
                expect(piwikUsageTracking.trackers.length).to.eql(3);
            });

            it('should be initialized by a push method', function() {
                piwikUsageTracking.initialized = false;
                _paq.push(['getTrackerUrl']);
                expect(piwikUsageTracking.initialized).to.be.true;
                expect(piwikUsageTracking.trackers.length).to.eql(3);
            });
        });


        describe('#trackers', function() {
            it('should have created multiple trackers with correct idSite, domain and custom variables', function() {
                var tracker1 = piwikUsageTracking.trackers[0];
                var tracker2 = piwikUsageTracking.trackers[1];
                var tracker3 = piwikUsageTracking.trackers[2];

                expect(tracker1.getTrackerUrl()).to.eql('http://localhost/piwik.php');
                expect(tracker1.getSiteId()).to.eql(1);
                expect(tracker1.getCustomVariable(1, 'visit')).to.eql(['Access', 'user']);

                expect(tracker2.getTrackerUrl()).to.eql('http://127.0.0.1/piwik.php');
                expect(tracker2.getSiteId()).to.eql(20);
                expect(tracker2.getCustomVariable(1, 'visit')).to.eql(['Access', 'user']);

                expect(tracker3.getTrackerUrl()).to.eql('http://localhost/piwik.php');
                expect(tracker3.getSiteId()).to.eql(33);
                expect(tracker3.getCustomVariable(1, 'visit')).to.eql(['Access', 'user']);
            });

            it('should anonymize url and referrer', function() {
                var tracker = piwikUsageTracking.trackers[0];

                var request = tracker.getRequest('');
                expect(request).to.contain('&url=http%3A%2F%2Fdemo.piwik.org%2F%3F');
                expect(request).to.contain('&_cvar=%7B%221%22%3A%5B%22Access%22%2C%22user%22%5D%7D');
                expect(request).to.not.contain('urlref=');

            });

            it('should not anonymize url and referrer', function() {

                for (var i = 1; i < piwikUsageTracking.trackers.length; i++) {
                    var tracker = piwikUsageTracking.trackers[i];

                    var request = tracker.getRequest('');
                    expect(request).to.not.contain('&url=http%3A%2F%2Fdemo.piwik.org%2F%3F');
                    expect(request).to.contain('urlref=');
                }
            });
        });

        describe('_paq.push', function() {
            it('should call a method with parameters on all tracker instances', function() {
                var tracker1 = piwikUsageTracking.trackers[0];
                var tracker2 = piwikUsageTracking.trackers[1];
                var tracker3 = piwikUsageTracking.trackers[2];

                _paq.push(['setCustomData', 'mykey', 'myvalue']);

                expect(tracker1.getCustomData()).to.eql({mykey: 'myvalue'});
                expect(tracker2.getCustomData()).to.eql({mykey: 'myvalue'});
                expect(tracker3.getCustomData()).to.eql({mykey: 'myvalue'});
            });

            it('should not fail when calling a non existing tracker method', function() {
                _paq.push(['setNotExisTiNGmeThod', 'mykey', 'myvalue']);
            });

            it('should call a function in the context of tracker', function() {
                _paq.push([function () {
                    expect(this.getSiteId()).to.be.at.least(1);
                }]);
            });
        });
    });
})();