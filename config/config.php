<?php

return array(
    'AnonymousPiwikUsageMeasurement.piwikVersion' => \Piwik\Version::VERSION,
    'AnonymousPiwikUsageMeasurement.phpVersion' => phpversion(),
    \Piwik\View\SecurityPolicy::class => DI\decorate(function ($previous) {
        /** @var \Piwik\View\SecurityPolicy $previous */

        $settings = new Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings();
        $customSiteUrl = $settings->getSetting('customSiteUrl')->getValue();
        if (!empty($customSiteUrl)) {
            $previous->addPolicy('default-src', parse_url($customSiteUrl, PHP_URL_HOST));
        }
        return $previous;
    })
);
