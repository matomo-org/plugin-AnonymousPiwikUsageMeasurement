/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

$(function () {

    if ('undefined' === (typeof piwikUsageTracking)
        || !piwikUsageTracking
        || !piwikUsageTracking.targets
        || !piwikUsageTracking.targets.length) {
        return;
    }

    var trackingDomain = 'http://demo.piwik.org';
    var trackers = [];

    _paq = {
        push: function() {
            // push a method to all available trackers
            $.each(arguments, function (i, parameterArray) {
                var method = parameterArray.shift();

                $.each(trackers, function (index, tracker) {
                    // the users piwik might not support a method yet, only execute if it exists
                    if (angular.isString(method) && tracker[method]) {
                        tracker[method].apply(tracker, parameterArray);
                    } else if (angular.isFunction(method)) {
                        method.apply(tracker, parameterArray);
                    }
                });
            });
        }
    };

    function makeDemoPiwikUrl(url)
    {
        if (0 === url.indexOf('#')) {
            url = url.substr(1);
        }

        if (0 === url.indexOf('?')) {
            url = url.substr(1);
        }

        return trackingDomain + '/index.php?' + url;
    }

    function anonymizeReferrer(tracker)
    {
        var anonymizedReferrer = trackingDomain + '/anonymized-referrer';

        var referrer = tracker.getReferrerUrl();
        if (tracker.getReferrerUrl && -1 !== referrer.indexOf(piwik.piwik_url)) {
            anonymizedReferrer = referrer.replace(piwik.piwik_url, trackingDomain + '/')
        }

        tracker.setReferrerUrl(anonymizedReferrer);
    }

    function anonymizeUrl(tracker)
    {
        var anonymizedUrl;

        if (location.hash && location.hash.length > 3) {
            anonymizedUrl = makeDemoPiwikUrl(location.hash);
        } else if (location.search && location.search.length > 3) {
            anonymizedUrl = makeDemoPiwikUrl(location.hash);
        } else {
            anonymizedUrl = makeDemoPiwikUrl('');
        }

        tracker.setCustomUrl(anonymizedUrl);
    }

    function createTrackers()
    {
        $.each(piwikUsageTracking.targets, function (index, target) {
            var tracker = Piwik.getTracker(target.url, target.idSite);
            if (target.cookieDomain) {
                tracker.setCookieDomain(target.cookieDomain);
            }

            anonymizeReferrer(tracker);
            anonymizeUrl(tracker);

            trackers.push(tracker);
        });

        // we cannot enable link tracking or JS error tracking as it is too likely that custom data is tracked
        $.each(piwikUsageTracking.visitorCustomVariables, function (j, customVar) {
            _paq.push(['setCustomVariable', customVar.id, customVar.name, customVar.value]);
        });

        _paq.push(['setDocumentTitle', document.title]);
    }

    createTrackers();

    _paq.push(['trackPageView']);

    var $rootScope = angular.element(document).injector().get('$rootScope');

    $rootScope.$on('$locationChangeSuccess', function () {
        _paq.push(['trackPageView']);
    });
});