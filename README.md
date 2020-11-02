# Matomo AnonymousPiwikUsageMeasurement Plugin

[![Build Status](https://travis-ci.com/matomo-org/plugin-AnonymousPiwikUsageMeasurement.svg?branch=4.x-dev)](https://travis-ci.com/matomo-org/plugin-AnonymousPiwikUsageMeasurement)

## Description

Track usage of your Matomo service into up to two Matomos:

* your own Matomo (can be configured optionally)
* a custom Matomo (can be configured optionally)

### What is Matomo doing to make sure the data is anonymized?

We are very careful in what we track and we make sure to anonymize data that could contain user data.

* We overwrite the page title as the title could contain the name of the viewed website
* We remove any referrer information
* We replace URL parameters with a predefined value apart from a few whitelisted ones to make sure no actual token_auth, CSRF token or user defined value will be tracked
* We do not just track any outlinks or downloads

We track any information as efficient as possible to not slow down your Matomo. If you have already performance problems with your Matomo we recommend to not install this plugin though.

### Which data is tracked?

When the plugin is activated, the following data will be tracked:

* The pages and reports that are viewed
* The visitors' software and devices data like the used browser and the resolution
* Some clicks or interactions with certain selectors or buttons. For example we track an event when a segment is selected but we do not track the actual segment.
* In a daily task we track the following data:
  * Matomo version
  * PHP version
  * Number of websites
  * Number of users
  * Number of segments
  * How often which API method was called (only plugin name and method name but no parameters) and how long the API calls took on average.
