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

    var trackers = [];

    _paq = {
        push: function() {
            // push a method to all available trackers
            $.each(arguments, function (i, parameterArray) {
                var method = parameterArray.shift();

                $.each(trackers, function (index, tracker) {
                    // the users piwik might not support a method yet, only execute if it exists
                    if ($.isString(method) && tracker[method]) {
                        tracker[method].apply(tracker, parameterArray);
                    } else if ($.isFunction(method)) {
                        method.apply(tracker, parameterArray);
                    }
                });
            });
        }
    };

    function createTrackers()
    {
        $.each(piwikUsageTracking.targets, function (index, target) {
            var tracker = Piwik.getTracker(target.url, target.idSite);
            if (target.cookieDomain) {
                tracker.setCookieDomain(target.cookieDomain);
            }
            trackers.push(tracker);
        });
    }

    function initTrackers()
    {
        // we cannot enable link tracking or JS error tracking as it is too likely that custom data is tracked

        $.each(piwikUsageTracking.visitorCustomVariables, function (j, customVar) {
            _paq.push(['setCustomVariable', customVar.id, customVar.name, customVar.value]);
        });

        _paq.push(['setDocumentTitle', document.title]);
        _paq.push(['trackPageView']);

        // TODO: change referrer if not from this URL
        // configReferrerUrl
        // replace domain urL
    }

    createTrackers();
    initTrackers();

    var $rootScope = angular.element(document).injector().get('$rootScope');

    $rootScope.$on('$locationChangeSuccess', function () {
        _paq.push(['trackPageView']);
    });
});