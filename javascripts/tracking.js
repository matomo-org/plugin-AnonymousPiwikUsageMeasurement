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
                    if (angular.isString(method) && tracker[method]) {
                        tracker[method].apply(tracker, parameterArray);
                    } else if (angular.isFunction(method)) {
                        method.apply(tracker, parameterArray);
                    }
                });
            });
        }
    };

    function anonymizeReferrer(tracker)
    {
        tracker.setReferrerUrl('');
    }

    function anonymizeUrl(tracker)
    {
        var url = urlAnonymizer.getCurrentAnonymizedUrl();
        url = urlAnonymizer.makeUrlHierarchical(url);
        tracker.setCustomUrl(url);
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

    function trackPageView()
    {
        var module  = urlAnonymizer.getValueFromHashOrUrl('module')
        var action  = urlAnonymizer.getValueFromHashOrUrl('action');
        var popover = urlAnonymizer.getPopoverNameFromUrl();

        angular.forEach(trackers, anonymizeUrl);

        _paq.push(['setCustomVariable', 1, 'module', module, 'page']);
        _paq.push(['setCustomVariable', 2, 'action', action, 'page']);

        if (popover) {
            _paq.push(['setCustomVariable', 3, 'popover', popover, 'page']);
        }

        _paq.push(['trackPageView']);
    }

    function trackContentImpressions()
    {
        _paq.push(['trackAllContentImpressions']);
    }

    createTrackers();
    trackPageView();
    trackContentImpressions();

    $(broadcast).bind('locationChangeSuccess', function () {
        trackContentImpressions();
    });

    var $rootScope = angular.element(document).injector().get('$rootScope');

    $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
        if (newUrl === oldUrl) {
            return;
        }

        trackPageView();
        trackContentImpressions();
    });
});