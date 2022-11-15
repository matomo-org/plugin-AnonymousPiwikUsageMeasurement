<?php

use Matomo\Dependencies\DI;

return array(
    'AnonymousPiwikUsageMeasurement.piwikVersion' => \Piwik\Version::VERSION,
    'AnonymousPiwikUsageMeasurement.phpVersion' => phpversion(),
    'Piwik\View\SecurityPolicy' => DI\decorate(function ($previous) {
        /** @var \Piwik\View\SecurityPolicy $previous */

        if (!\Piwik\SettingsPiwik::isMatomoInstalled()) {
            // if Matomo is not yet installed there can't be any system setting
            return $previous;
        }

        try {
            $settings = new Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings();
            $customSiteUrl = $settings->getSetting('customSiteUrl')->getValue();
            $host = parse_url($customSiteUrl, PHP_URL_HOST);
            if (!empty($customSiteUrl) && !empty($host)) {
                $previous->addPolicy('default-src', $host);
            }
        } catch (\Exception $e) {
            // ignore possible errors as they might break Matomo
        }
        return $previous;
    })
);
