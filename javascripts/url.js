var UrlAnonymizer = function (absoluteUrl) {

    var whitelistUrlParams = ['module', 'action', 'idSite', 'idDashboard', 'period', 'date', 'popover', 'idGoal', 'pluginName', 'category', 'subcategory'];
    var isPiwik3Reporting = isPiwik3ReportingUrl();

    function isPiwik3ReportingUrl()
    {
        var category = broadcast.getValueFromHash('category', absoluteUrl);
        var subcategory = broadcast.getValueFromHash('subcategory', absoluteUrl);

        if (!!category && !!subcategory) {
            return true;
        }

        category = broadcast.getValueFromUrl('category', absoluteUrl);
        subcategory = broadcast.getValueFromUrl('subcategory', absoluteUrl);

        return (!!category && !!subcategory);
    }

    function getTrackingDomain()
    {
        if ('undefined' !== (typeof piwikUsageTracking)
            && piwikUsageTracking && piwikUsageTracking.trackingDomain) {
            return piwikUsageTracking.trackingDomain;
        }
    }

    function removeFirstPartFromTranslationKeyIfPresent(translationKey)
    {
        var posUnderscore = translationKey.indexOf('_');
        if (posUnderscore >= 1) {
            translationKey = translationKey.substr(posUnderscore + 1);
        }

        return translationKey;
    }

    function isNumber(string)
    {
        return /^\d+$/.test(string + '');
    }

    function getTopLevelId()
    {
        var id = '';
        if (isPiwik3Reporting) {
            id = getValueFromHashOrUrl('category', absoluteUrl);
            id = removeFirstPartFromTranslationKeyIfPresent(id);
        } else {
            id = getValueFromHashOrUrl('module');
        }

        return id;
    }

    function getSubLevelId()
    {
        var id = '';

        if (isPiwik3Reporting) {
            id = broadcast.getValueFromHash('subcategory', absoluteUrl);
            id = removeFirstPartFromTranslationKeyIfPresent(id);

            if (isNumber(id)) {
                // prevent titles or urls like 'Dashboard 6' (Dashboard Id 6) or 'Goal 5' (Goal Id 5)
                id = '';
            }
        } else {
            id = getValueFromHashOrUrl('action');
        }

        return id;
    }

    function makeUrlHierarchical(url)
    {
        var anonymizer = new UrlAnonymizer(url);

        var module = anonymizer.getTopLevelId();
        var action = anonymizer.getSubLevelId();

        if (!action) {
            action = 'default';
        }

        var search = anonymizer.getSearchFromUrl();

        var hierarchicalUrl = getTrackingDomain() + '/';
        if (module) {
            hierarchicalUrl += module + '/' + action + '/';
        }

        var searchParams = broadcast.extractKeyValuePairsFromQueryString(search);

        delete searchParams['module'];
        delete searchParams['action'];
        delete searchParams['category'];
        delete searchParams['subcategory'];

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

    function getSearchFromUrl()
    {
        var searchPos = absoluteUrl.indexOf('?');

        if (-1 === searchPos) {
            return '';
        }

        var search = absoluteUrl.substr(searchPos + 1);

        if (search && search.match('#')) {
            search = search.substring(0, search.indexOf("#"));
        }

        return search;
    }

    function getBlacklistedUrlParams()
    {
        var search = getSearchFromUrl();

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

    function anonymizeUrlParams(paramsToAnonymize)
    {
        $.each(paramsToAnonymize, function (i, paramToAnonymize) {
            if (-1 !== absoluteUrl.indexOf(paramToAnonymize + '=')) {
                // make sure to anonymize token_auth
                absoluteUrl = broadcast.updateParamValue(paramToAnonymize + '=XYZ', absoluteUrl);

                var toBeReplaced = paramToAnonymize + '=&' + paramToAnonymize + '=XYZ';
                if (absoluteUrl.indexOf(toBeReplaced) > 0) {
                    // workaround a bug in broadcast.updateParamValue when paramToAnonymize is given but no value assigned
                    absoluteUrl = absoluteUrl.replace(toBeReplaced, paramToAnonymize + '=XYZ');
                }
            }
        });

        return absoluteUrl;
    }

    function anonymizeIntegerValueInUrl(urlParam)
    {
        if (-1 !== absoluteUrl.indexOf(urlParam + '=')) {
            var oldValue = getValueFromHashOrUrl(urlParam)
            var newValue = (oldValue % 20); // max 20
            if (newValue === 0) {
                newValue = 20;
            }
            // anonymize idSite, if there is a Piwik instance having many sites, one could maybe identify a specific
            // instance based on a high siteid
            absoluteUrl = broadcast.updateParamValue(urlParam + '=' + newValue, absoluteUrl);
        }

        return absoluteUrl;
    }

    function anonymizePopoverName()
    {
        var popoverName = getPopoverNameFromUrl();
        if (popoverName) {
            // anonymize visitor ids etc. Otherwise one could check if your own visitor id is present in demo-anonymous.piwik.org
            // and identify specific piwik instances and see which Piwik and PHP version they use, whether they use
            // this plugin and what they do with their piwik. Also a transition or row evolution could include a URL
            // etc
            absoluteUrl = broadcast.updateParamValue('popover=' + popoverName, absoluteUrl);
        } else if (-1 !== absoluteUrl.indexOf('popover=')) {
            absoluteUrl = anonymizeUrlParams(['popover']);
        }

        return absoluteUrl;
    }

    function getHashFromUrl()
    {
        if (absoluteUrl && absoluteUrl.match('#')) {
            return absoluteUrl.substring(absoluteUrl.indexOf("#"), absoluteUrl.length);
        }

        return '';
    }

    function getAnonymizedUrl()
    {
        var anonymizedUrl;
        var hash = getHashFromUrl();
        var search = getSearchFromUrl();

        if (hash && hash.length > 4) {
            anonymizedUrl = makeDemoPiwikUrl(hash);
        } else if (search && search.length > 4) {
            anonymizedUrl = makeDemoPiwikUrl(search);
        } else {
            anonymizedUrl = makeDemoPiwikUrl('');
        }

        var anonmized = new UrlAnonymizer(anonymizedUrl);

        var blacklistedParams = anonmized.getBlacklistedUrlParams();

        blacklistedParams.push('token_auth');

        // make sure to anonymize nonce, otherwise one could look for nonce token on demo-anonymous.piwik.org and test it
        // on several instances
        blacklistedParams.push('nonce');

        anonmized.anonymizeUrlParams(blacklistedParams);

        // anonymize idGoal, if there is a Piwik instance having many goal ids and the goal is tracked manually,
        // one could maybe identify a specific instance
        anonmized.anonymizeIntegerValueInUrl('idGoal');
        // anonymize idSite, if there is a Piwik instance having many sites, one could maybe identify a specific
        // instance based on a high siteid
        anonmized.anonymizeIntegerValueInUrl('idSite');
        anonmized.anonymizeIntegerValueInUrl('idDashboard');

        anonymizedUrl = anonmized.anonymizePopoverName();

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

    function getValueFromHashOrUrl(param)
    {
        var isHashUrlInPiwik3 = isPiwik3Reporting && broadcast.getValueFromHash('category', absoluteUrl);
        var isHashUrlInPiwik2 = !isPiwik3Reporting && broadcast.getValueFromHash('module', absoluteUrl);

        if (isHashUrlInPiwik3 || isHashUrlInPiwik2) {

            return broadcast.getValueFromHash(param, absoluteUrl);
            // fallback to Url only if there is no url in hash specified. Otherwise we'd return wrong value,
            // eg action doesn't have to be specified in hash, using the one from Url would be wrong if there is a module
            // specified in hash
        }

        var value = broadcast.getValueFromUrl(param, absoluteUrl);

        if (!value) {
            // we make sure to work with strings
            value = '';
        }

        return value;
    }

    function getPopoverNameFromUrl()
    {
        var popover = getValueFromHashOrUrl('popover');

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
        makeUrlHierarchical: makeUrlHierarchical,
        isPiwik3ReportingUrl: isPiwik3ReportingUrl,
        getAnonymizedUrl: getAnonymizedUrl,
        getValueFromHashOrUrl: getValueFromHashOrUrl,
        getPopoverNameFromUrl: getPopoverNameFromUrl,
        getTopLevelId: getTopLevelId,
        getSubLevelId: getSubLevelId,
        getBlacklistedUrlParams: getBlacklistedUrlParams,
        getSearchFromUrl: getSearchFromUrl,
        getHashFromUrl: getHashFromUrl,
        anonymizeIntegerValueInUrl: anonymizeIntegerValueInUrl,
        anonymizeUrlParams: anonymizeUrlParams,
        anonymizePopoverName: anonymizePopoverName
    };
};