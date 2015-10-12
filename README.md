# Piwik AnonymousPiwikUsageMeasurement Plugin

## Description

Track usage of your Piwik into up to three Piwiks:

* demo.piwik.org (enabled by default but can be disabled). The tracked data will be used to make Piwik better. Thank you for your help!
* your own Piwik (can be configured optionally)
* a custom Piwik (can be configured optionally)

### Which data is tracked?

* The pages that are viewed
* Visitor software and devices data like browser, resolution, ...
* On demo.piwik.org 3 bytes of the IP are anonymised (eg when IP is 192.168.1.1 we track only 192.0.0.0). Original IP is not used to identify your location.
* Referrer is removed and not tracked
* No `token_auth` will be sent
* If you have developed a custom Piwik plugin that contains eg the name of your business in any of the following names we recommend to not install this plugin as it might be tracked:
  * name of a plugin
  * name of a controller action
  * name of a report
  * name of a widget
  * name of an API method
* In a daily task we track the following data:
  * Piwik version
  * PHP version
  * Number of websites
  * Number of users
  * Number of segments
  * How often which API method was called (only plugin name and method name but no parameters)

### Requirements
* The Piwik server must have a connection to the internet

## FAQ

__When should I not install this plugin?__

Do not install this plugin if you have any custom plugins installed whose URL or plugin name could identify you. Eg if a controller action or a report
contains the name of your business, this information might be sent to piwik.org and can be viewed by visitors of [http://demo.piwik.org]() .

__Who has access to the tracked data at demo.piwik.org?__

The data will be made public and therefore can be seen by anyone on [http://demo.piwik.org](http://demo.piwik.org).
This is to assure the tracked data is anonymous (transparency) and to showcase how Piwik can be used to track an application.

## Changelog

* 0.1.0 Initial release

## Support

Please direct any feedback to https://github.com/piwik/plugin-AnonymousPiwikUsageMeasurement/issues or [hello@piwik.org](mailto:hello@piwik.org)