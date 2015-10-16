var urlAnonymizer = (function () {

    var whitelistUrlParams = ['module', 'action', 'idSite', 'idDashboard', 'period', 'date', 'popover', 'idGoal', 'pluginName'];

    function getTrackingDomain()
    {
        if ('undefined' !== (typeof piwikUsageTracking)
            && piwikUsageTracking && piwikUsageTracking.trackingDomain) {
            return piwikUsageTracking.trackingDomain;
        }
    }

    function makeUrlHierarchical(url)
    {
        var module = broadcast.getValueFromUrl('module', url);
        var action = broadcast.getValueFromUrl('action', url);
        if (!action) {
            action = 'default';
        }

        var search = getSearchFromUrl(url);

        var hierarchicalUrl = getTrackingDomain() + '/';
        if (module) {
            hierarchicalUrl += module.toLowerCase() + '/' + action.toLowerCase() + '/';
        }

        var searchParams = broadcast.extractKeyValuePairsFromQueryString(search);

        if ('module' in searchParams) {
            delete searchParams['module'];
        }
        if ('action' in searchParams) {
            delete searchParams['action'];
        }

        hierarchicalUrl += '?';
        $.each(searchParams, function (key, value) {
            hierarchicalUrl += key + '=' + value + '&';
        });

        if (endsWith(hierarchicalUrl, '&')) {
            hierarchicalUrl = hierarchicalUrl.substr(0, hierarchicalUrl.length - 1);
        }

        return hierarchicalUrl;
    }

    function endsWith(string, needle)
    {
        return string.substr(-1 * needle.length, needle.length) === needle;
    }

    function getSearchFromUrl(url)
    {
        var searchPos = url.lastIndexOf('?');

        if (-1 === searchPos) {
            return '';
        }

        return url.substr(searchPos + 1);
    }

    function getBlacklistedUrlParams(url)
    {
        var search = getSearchFromUrl(url);

        if (!search) {
            return [];
        }

        var pairs = broadcast.extractKeyValuePairsFromQueryString(search);
        var blacklisted = [];
        $.each(pairs, function (key, value) {
            if (-1 === whitelistUrlParams.indexOf(key)) {
                blacklisted.push(key);
            }
        });

        return blacklisted;
    }

    function anonymizeUrlParams(url, paramsToAnonymize)
    {
        $.each(paramsToAnonymize, function (i, paramToAnonymize) {
            if (-1 !== url.indexOf(paramToAnonymize + '=')) {
                // make sure to anonymize token_auth
                url = broadcast.updateParamValue(paramToAnonymize + '=XYZ', url);
            }
        });

        return url;
    }

    function anonymizeIntegerValueInUrl(url, urlParam)
    {
        if (-1 !== url.indexOf(urlParam + '=')) {
            var oldValue = getValueFromHashOrUrl(urlParam, url)
            var newValue = (oldValue % 20); // max 20
            if (newValue === 0) {
                newValue = 20;
            }
            // anonymize idSite, if there is a Piwik instance having many sites, one could maybe identify a specific
            // instance based on a high siteid
            url = broadcast.updateParamValue(urlParam + '=' + newValue, url);
        }

        return url;
    }

    function getAnonymizedUrl(location)
    {
        var anonymizedUrl;

        if (location.hash && location.hash.length > 4) {
            anonymizedUrl = makeDemoPiwikUrl(location.hash);
        } else if (location.search && location.search.length > 4) {
            anonymizedUrl = makeDemoPiwikUrl(location.search);
        } else {
            anonymizedUrl = makeDemoPiwikUrl('');
        }

        var blacklistedParams = getBlacklistedUrlParams(anonymizedUrl);
        blacklistedParams.push('token_auth');

        // make sure to anonymize nonce, otherwise one could look for nonce token on demo-anonymous.piwik.org and test it
        // on several instances
        blacklistedParams.push('nonce');

        anonymizedUrl = anonymizeUrlParams(anonymizedUrl, blacklistedParams);

        // anonymize idGoal, if there is a Piwik instance having many goal ids and the goal is tracked manually,
        // one could maybe identify a specific instance
        anonymizedUrl = anonymizeIntegerValueInUrl(anonymizedUrl, 'idGoal');
        // anonymize idSite, if there is a Piwik instance having many sites, one could maybe identify a specific
        // instance based on a high siteid
        anonymizedUrl = anonymizeIntegerValueInUrl(anonymizedUrl, 'idSite');
        anonymizedUrl = anonymizeIntegerValueInUrl(anonymizedUrl, 'idDashboard');

        var popoverName = getPopoverNameFromUrl(anonymizedUrl);
        if (popoverName) {
            // anonymize visitor ids etc. Otherwise one could check if your own visitor id is present in demo-anonymous.piwik.org
            // and identify specific piwik instances and see which Piwik and PHP version they use, whether they use
            // this plugin and what they do with their piwik. Also a transition or row evolution could include a URL
            // etc
            anonymizedUrl = broadcast.updateParamValue('popover=' + popoverName, anonymizedUrl);
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

        return getTrackingDomain() + '/index.php?' + url;
    }

    function getValueFromHashOrUrl(param, url)
    {
        if (broadcast.getValueFromHash('module', url)) {
            return broadcast.getValueFromHash(param, url);
            // fallback to Url only if there is no url in hash specified. Otherwise we'd return wrong value,
            // eg action doesn't have to be specified in hash, using the one from Url would be wrong if there is a module
            // specified in hash
        }

        var value = broadcast.getValueFromUrl(param, url);

        if (!value) {
            // we make sure to work with strings
            value = '';
        }

        return value;
    }

    function getPopoverNameFromUrl(url)
    {
        var popover = getValueFromHashOrUrl('popover', url);

        if (popover && -1 !== popover.indexOf('$')) {
            popover = decodeURIComponent(popover.replace(/\$/g, '%'));

            if (0 === popover.indexOf('RowAction:')) {
                popover = popover.split(':', 2).join(':');
                // use max first two parts as a URL includes a ":" as well eg "RowAction:Transitions:url:http://"
                // to be safe we use only "RowAction:Transitions" in this case.
                return popover;
            } else if (-1 !== popover.indexOf(':')) {
                // eg "visitorProfile:7c0811af3c64efab", we only want to keep "VisitorProfile"
                return popover.substr(0, popover.indexOf(':'));
            }
        }

        return '';
    }

    return {
        getAnonymizedUrl: getAnonymizedUrl,
        makeUrlHierarchical: makeUrlHierarchical,
        getValueFromHashOrUrl: getValueFromHashOrUrl,
        getPopoverNameFromUrl: getPopoverNameFromUrl
    };
})();