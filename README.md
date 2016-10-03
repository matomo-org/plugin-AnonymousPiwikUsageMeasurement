# Piwik AnonymousPiwikUsageMeasurement Plugin

[![Build Status](https://travis-ci.org/piwik/plugin-AnonymousPiwikUsageMeasurement.svg?branch=master)](https://travis-ci.org/piwik/plugin-AnonymousPiwikUsageMeasurement)

## Description

Help us to improve Piwik by sending anonymous usage data of your Piwik service to the creators of Piwik and/or get usage data yourself.

Track usage of your Piwik service into up to three Piwiks:

* [demo-anonymous.piwik.org](https://demo-anonymous.piwik.org) (enabled by default but can be disabled). The tracked data will be used to make Piwik better. Thank you for your help!
* your own Piwik (can be configured optionally)
* a custom Piwik (can be configured optionally)

### What is Piwik doing to make sure the data is anonymized?

We are very careful in what we track and we make sure to anonymize data that could contain user data.

* We overwrite the page title as the title could contain the name of the viewed website
* We remove any referrer information
* We replace URL paramaters with a predefined value apart from a few whitelisted ones to make sure no actual token_auth, CSRF token or user defined value will be tracked
* On demo-anonymous.piwik.org 3 bytes of the IP are anonymised (eg when IP is 192.168.1.1 we track only 192.0.0.0). The original IP is not used to identify your location and provider information is not collected. 
* We do not just track any outlinks or downloads

### When should I not install this plugin?

If you have developed a custom Piwik plugin that contains for example the name of your business in any of the following names we recommend to not install this plugin as it might be tracked:

* name of a plugin
* name of a controller action
* name of a report
* name of a widget
* name of an API method

Plugins that are installed via the Marketplace should not pose a problem as their names don't contain any user specific information such as the name of your business.

We track any information as efficient as possible to not slow down your Piwik. If you have already performance problems with your Piwik we recommend to not install this plugin though.

### Which data is tracked?

When the plugin is activated, the following data will be tracked:

* The pages and reports that are viewed
* The visitors' software and devices data like the used browser and the resolution
* Some clicks or interactions with certain selectors or buttons. For example we track an event when a segment is selected but we do not track the actual segment.
* In a daily task we track the following data:
  * Piwik version
  * PHP version
  * Number of websites
  * Number of users
  * Number of segments
  * How often which API method was called (only plugin name and method name but no parameters) and how long the API calls took on average.
