/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

if ('undefined' === (typeof piwikUsageTracking) || !piwikUsageTracking) {
    piwikUsageTracking = {targets: [], visitorCustomVariables: []};
}

piwikUsageTracking.trackers = [];
piwikUsageTracking.initialized = false;
piwikUsageTracking.createTrackersIfNeeded = function ()
{
    if (piwikUsageTracking.initialized) {
        return;
    }

    piwikUsageTracking.initialized = true;

    if (!piwikUsageTracking.targets || !piwikUsageTracking.targets.length) {
        return;
    }

    $.each(piwikUsageTracking.targets, function (index, target) {
        var tracker = Piwik.getTracker(target.url, target.idSite);

        if (target.cookieDomain) {
            tracker.setCookieDomain(target.cookieDomain);
        }

        // we could do those calls later via `paq.push` but I want to make sure those methods are called and anonymized
        // eg if there was a typo in `setDocumentTitle` we would not notice the method is not executed otherwise and
        // it would result in a not anonymized title
        anonymizeReferrer(tracker);
        anonymizeTitle(tracker);
        anonymizeUrl(tracker);

        piwikUsageTracking.trackers.push(tracker);
    });

    // we cannot enable link tracking or JS error tracking as it is too likely that custom data is tracked
    $.each(piwikUsageTracking.visitorCustomVariables, function (j, customVar) {
        _paq.push(['setCustomVariable', customVar.id, customVar.name, customVar.value]);
    });

    trackPageView();

    function ucfirst(text)
    {
        var firstLetter = ('' + text).charAt(0).toUpperCase();
        return firstLetter + text.substr(1);
    }

    function anonymizeTitle(tracker)
    {
        var module  = urlAnonymizer.getValueFromHashOrUrl('module')
        var action  = urlAnonymizer.getValueFromHashOrUrl('action');

        var title = 'Piwik Web Analytics';

        if (module) {
            title = ucfirst(module);

            if (action) {
                title += ' ' + ucfirst(action);
            }
        }

        tracker.setDocumentTitle(title);
    }

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

    function trackPageView()
    {
        var module  = urlAnonymizer.getValueFromHashOrUrl('module')
        var action  = urlAnonymizer.getValueFromHashOrUrl('action');
        var popover = urlAnonymizer.getPopoverNameFromUrl();

        angular.forEach(piwikUsageTracking.trackers, anonymizeTitle);
        angular.forEach(piwikUsageTracking.trackers, anonymizeUrl);

        if (popover) {
            _paq.push(['setCustomVariable', 1, 'popover', popover, 'page']);
        }

        _paq.push(['trackPageView']);
    }

    $(function () {
        var $rootScope = angular.element(document).injector().get('$rootScope');

        $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
            if (newUrl === oldUrl) {
                return;
            }

            trackPageView();
        });
    });
};

var _paq = {
    push: function() {
        piwikUsageTracking.createTrackersIfNeeded();

        // push a method to all available trackers
        $.each(arguments, function (i, parameterArray) {
            var method = parameterArray.shift();

            $.each(piwikUsageTracking.trackers, function (index, tracker) {
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

(function () {
    piwikUsageTracking.createTrackersIfNeeded();
})();

