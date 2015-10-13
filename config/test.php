<?php

return array(
    'AnonymousPiwikUsageMeasurement.piwikVersion' => '2.14.3',
    'AnonymousPiwikUsageMeasurement.phpVersion' => '5.5.27',
    'Piwik\Plugins\AnonymousPiwikUsageMeasurement\Settings' => DI\decorate(function (\Piwik\Plugins\AnonymousPiwikUsageMeasurement\Settings $settings) {
        \Piwik\Access::doAsSuperUser(function () use ($settings) {
            // make sure no tracking is enabled when running tests, especially on travis and during ui tests
            $settings->trackToPiwik->setValue(false);
            $settings->ownPiwikSiteId->setValue(0);
            $settings->customPiwikSiteId->setValue(0);
        });

        return $settings;
    }),

);
