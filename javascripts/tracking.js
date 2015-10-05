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
    var whitelistUrlParams = ['module', 'action', 'idSite', 'period', 'date'];

    _paq = {
        push: function() {
            // push a method to all available trackers
            $.each(arguments, function (i, parameterArray) {
                var method = parameterArray.shift();

                $.each(trackers, function (index, tracker) {
                    // make sure the url is anonymized all the time
                    anonymizeUrl(tracker);

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
        tracker.setCustomUrl(getCurrentAnonymizedUrl());
    }

    function getCurrentAnonymizedUrl()
    {
        var anonymizedUrl;

        if (location.hash && location.hash.length > 3) {
            anonymizedUrl = makeDemoPiwikUrl(location.hash);
        } else if (location.search && location.search.length > 3) {
            anonymizedUrl = makeDemoPiwikUrl(location.hash);
        } else {
            anonymizedUrl = makeDemoPiwikUrl('');
        }

        if (-1 !== anonymizedUrl.indexOf('token_auth=')) {
            // make sure to anonymize token_auth
            anonymizedUrl = broadcast.updateParamValue('token_auth=XYZ', anonymizedUrl);
        }

        if (-1 !== anonymizedUrl.indexOf('nonce=')) {
            // make sure to anonymize nonce, otherwise one could look for nonce token on demo.piwik.org and test it
            // on several instances
            anonymizedUrl = broadcast.updateParamValue('nonce=XYZ', anonymizedUrl);
        }

        if (-1 !== anonymizedUrl.indexOf('idGoal=')) {
            var goalId = getValueFromHashOrUrl('idGoal', anonymizedUrl)
            goalId = (goalId % 20) + 1; // idGoal = max 20
            // anonymize idGoal, if there is a Piwik instance having many goal ids and the goal is tracked manually,
            // one could maybe identify a specific instance
            anonymizedUrl = broadcast.updateParamValue('idGoal='. goalId, anonymizedUrl);
        }

        if (-1 !== anonymizedUrl.indexOf('idSite=')) {
            var idSite = getValueFromHashOrUrl('idSite', anonymizedUrl)
            idSite = (idSite % 20) + 1; // idSite = max 20
            // anonymize idSite, if there is a Piwik instance having many sites, one could maybe identify a specific
            // instance based on a high siteid
            anonymizedUrl = broadcast.updateParamValue('idSite='. idSite, anonymizedUrl);
        }

        var popoverName = getPopoverNameFromUrl(anonymizedUrl);
        if (popoverName) {
            // anonymize visitor ids etc. Otherwise one could check if your own visitor id is present in demo.piwik.org
            // and identify specific piwik instances and see which Piwik and PHP version they use, whether they use
            // this plugin and what they do with their piwik. Also a transition or row evolution could include a URL
            // etc
            anonymizedUrl = broadcast.updateParamValue('popover='. popoverName, anonymizedUrl);
        } else if (-1 !== anonymizedUrl.indexOf('popover=')) {
            anonymizedUrl = broadcast.updateParamValue('popover=XYZ', anonymizedUrl);
        }

        return anonymizedUrl;
    }

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

    function getValueFromHashOrUrl(param, url)
    {
        var value = broadcast.getValueFromHash(param, url);
        if (!value && !broadcast.getValueFromHash('module', url)) {
            // fallback to Url only if there is no url in hash specified. Otherwise we'd return wrong value,
            // eg action doesn't have to be specified in hash, using the one from Url would be wrong if there is a module
            // specified in hash
            value = broadcast.getValueFromUrl(param, url)
        } else {
            value = '';
        }

        return value;
    }

    function getPopoverNameFromUrl(url)
    {
        var popover = getValueFromHashOrUrl('popover', url);
        if (popover && -1 !== popover.indexOf('$')) {
            popover = popover.substr(0, popover.indexOf('$'));

            return popover;
        }

        return '';
    }

    function trackPageView()
    {
        var module = getValueFromHashOrUrl('module')
        var action = getValueFromHashOrUrl('action');
        var popover = getPopoverNameFromUrl();

        _paq.push(['setCustomVariable', 1, 'module', module, 'page']);
        _paq.push(['setCustomVariable', 2, 'action', action, 'page']);

        if (popover) {
            _paq.push(['setCustomVariable', 3, 'popover', popover, 'page']);
        }

        _paq.push(['trackPageView']);
    }

    createTrackers();

    trackPageView();

    var $rootScope = angular.element(document).injector().get('$rootScope');

    $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
        if (newUrl === oldUrl) {
            return;
        }

        trackPageView();
    });
});