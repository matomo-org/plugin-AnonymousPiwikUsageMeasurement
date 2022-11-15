<?php

use Matomo\Dependencies\DI;

return array(
    'AnonymousPiwikUsageMeasurement.piwikVersion' => '2.14.3',
    'AnonymousPiwikUsageMeasurement.phpVersion' => '5.5.27',
    'Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings' => DI\factory(function () {
        // we cannot decorate here as we need to create an instance of settings as super user, the permissions
        // for writing / reading are detected on settings creation, not each time it is executed

        $settings = null;
        \Piwik\Access::doAsSuperUser(function () use (&$settings) {
            $settings = new Piwik\Plugins\AnonymousPiwikUsageMeasurement\SystemSettings();
            // make sure no tracking is enabled when running tests, especially on travis and during ui tests
            $settings->ownPiwikSiteId->setValue(0);
            $settings->customPiwikSiteId->setValue(0);
        });

        return $settings;
    }),

);
