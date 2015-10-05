# Piwik AnonymousPiwikUsageMeasurement Plugin

## Description

Track usage of your Piwik into up to three Piwiks:

* demo.piwik.org which belongs to the creator of Piwik (enabled by default but can be disabled). The data is used to make Piwik better. Thank you for your help!
* your own Piwik (can be configured optionally)
* a custom Piwik (can be configured optionally)

Which data is tracked?

* The pages that are viewed
* Visitor software & devices data like browser, resolution, ...
* The used Piwik and PHP version
* On demo.piwik.org 3 bytes of the IP are anonymised (eg when IP is 192.168.1.1 we track only 192.0.0.0). Original IP is not used to identify your location.
* Referrer domains are removed and / or replaced with TODO
* No token_auth will be sent

## FAQ

__My question?__

My answer

## Changelog

* 0.1.0 Initial release

## Support

Please direct any feedback to https://github.com/piwik/plugin-AnonymousPiwikUsageMeasurement/issues or [hello@piwik.org](mailto:hello@piwik.org)