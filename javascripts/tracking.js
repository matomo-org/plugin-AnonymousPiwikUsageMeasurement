/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

if ('undefined' === (typeof piwikUsageTracking) || !piwikUsageTracking) {
    piwikUsageTracking = {targets: [], visitorCustomVariables: [], trackingDomain: '', exampleDomain: ''};
}

piwikUsageTracking.trackers = [];
piwikUsageTracking.initialized = false;
piwikUsageTracking.createTrackersIfNeeded = function ()
{
    if (piwikUsageTracking.initialized) {
        return;
    }

    piwikUsageTracking.trackers = [];
    piwikUsageTracking.initialized = true;

    if (!piwikUsageTracking.targets || !piwikUsageTracking.targets.length) {
        return;
    }

    var isHttps = location.protocol == "https:";

    $.each(piwikUsageTracking.targets, function (index, target) {
        if ('undefined' === (typeof Piwik)) {
            // blocked by ad blocker
            return;
        }

        if (isHttps && 0 === target.url.indexOf('http:')) {
            target.url = 'https://' + target.url.substring(location.protocol.length);
        }

        var tracker = Piwik.getTracker(target.url, target.idSite);
            tracker.isAnon = target.useAnonymization;
        // we could do those calls later via `paq.push` but I want to make sure those methods are called and anonymized
        // eg if there was a typo in `setDocumentTitle` we would not notice the method is not executed otherwise and
        // it would result in a not anonymized title

        if (!target.useAnonymization) {
            tracker.setUserId(piwikUsageTracking.userId);
        }

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

    function createUrlAnonymizer()
    {
        return new UrlAnonymizer(location.href);
    }

    function anonymizeTitle(tracker)
    {
        if (!tracker.isAnon) return;

        var urlAnonymizer = createUrlAnonymizer();
        var module  = urlAnonymizer.getTopLevelId()
        var action  = urlAnonymizer.getSubLevelId();

        var title = 'Matomo Web Analytics';

        if (module) {
            title = ucfirst(module);

            if (action) {
                title += ' ' + ucfirst(action);
            }
        } else if ($('#login_form').length) {
            // this is the case when eg opening http://example.matomo.org/ and one is not logged in (we show login page)
            title = 'Login';
        }

        tracker.setDocumentTitle(title);
    }

    function anonymizeReferrer(tracker)
    {
        if (!tracker.isAnon) return;

        tracker.setReferrerUrl('');
    }

    function anonymizeUrl(tracker)
    {
        if (!tracker.isAnon) return;

        var urlAnonymizer = createUrlAnonymizer();
        var url = urlAnonymizer.getAnonymizedUrl();
        url = urlAnonymizer.makeUrlHierarchical(url);

        tracker.setCustomUrl(url);
    }

    function trackPageView()
    {
        var urlAnonymizer = createUrlAnonymizer();
        var popover = urlAnonymizer.getPopoverNameFromUrl();

        (piwikUsageTracking.trackers || []).forEach(anonymizeTitle);
        (piwikUsageTracking.trackers || []).forEach(anonymizeUrl);

        if (popover) {
            _paq.push(['setCustomVariable', 1, 'popover', popover, 'page']);
        }

        _paq.push(['trackPageView']);
    }

    $(function () {
        $(broadcast).on('locationChangeSuccess', function () {
            trackPageView();
        });

        var watch = window.Vue.watch;
        var MatomoUrl = window.CoreHome.MatomoUrl;
        watch(
          function () { return MatomoUrl.url; },
          function (newUrl, oldUrl) {
            var urlAnonymizer = createUrlAnonymizer();

            if (urlAnonymizer.isPiwik3ReportingUrl() && newUrl !== oldUrl) {
              trackPageView();
            }
          },
        );
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
                if (typeof method === 'string' && tracker[method]) {
                    tracker[method].apply(tracker, parameterArray);
                } else if (typeof method === 'function') {
                    method.apply(tracker, parameterArray);
                }
            });
        });
    }
};

$(function () {
    if (piwikUsageTracking && piwikUsageTracking.createTrackersIfNeeded) {
        piwikUsageTracking.createTrackersIfNeeded();
    }
});
