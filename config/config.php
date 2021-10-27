<?php

return array(
    'AnonymousPiwikUsageMeasurement.piwikVersion' => \Piwik\Version::VERSION,
    'AnonymousPiwikUsageMeasurement.phpVersion' => phpversion(),
    'Piwik\View\SecurityPolicy' => DI\decorate(function ($previous) {
        /** @var \Piwik\View\SecurityPolicy $previous */

        $settings = new Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings();
        $customSiteUrl = $settings->getSetting('customSiteUrl')->getValue();
        $host = parse_url($customSiteUrl, PHP_URL_HOST);
        if (!empty($customSiteUrl) && !empty($host)) {
            $previous->addPolicy('default-src', $host);
        }
        return $previous;
    })
);
