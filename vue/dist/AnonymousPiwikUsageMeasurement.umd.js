(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("CoreHome"), require("vue"));
	else if(typeof define === 'function' && define.amd)
		define(["CoreHome", ], factory);
	else if(typeof exports === 'object')
		exports["AnonymousPiwikUsageMeasurement"] = factory(require("CoreHome"), require("vue"));
	else
		root["AnonymousPiwikUsageMeasurement"] = factory(root["CoreHome"], root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__19dc__, __WEBPACK_EXTERNAL_MODULE__8bbf__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "plugins/AnonymousPiwikUsageMeasurement/vue/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "19dc":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__19dc__;

/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "TrackDashboard", function() { return /* reexport */ TrackDashboard_TrackDashboard; });
__webpack_require__.d(__webpack_exports__, "TrackDashboardAction", function() { return /* reexport */ TrackDashboard_TrackDashboardAction; });
__webpack_require__.d(__webpack_exports__, "TrackEmailReports", function() { return /* reexport */ TrackEmailReports_TrackEmailReports; });
__webpack_require__.d(__webpack_exports__, "TrackMarketplace", function() { return /* reexport */ TrackMarketplace_TrackMarketplace; });
__webpack_require__.d(__webpack_exports__, "TrackMultiSites", function() { return /* reexport */ TrackMultiSites_TrackMultiSites; });
__webpack_require__.d(__webpack_exports__, "TrackSegment", function() { return /* reexport */ TrackSegment_TrackSegment; });

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: external "CoreHome"
var external_CoreHome_ = __webpack_require__("19dc");

// CONCATENATED MODULE: ./plugins/AnonymousPiwikUsageMeasurement/vue/src/types.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

// CONCATENATED MODULE: ./plugins/AnonymousPiwikUsageMeasurement/vue/src/TrackDashboard/TrackDashboard.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */


var _window = window,
    $ = _window.$;

function TrackDashboard_onClick() {
  var $widget = $(this);

  if (!$widget.parents('.sortable').length) {
    return;
  }

  var category = 'Dashboard';
  var name = 'Widget';
  var action = $(this).attr('id');

  window._paq.push(['trackEvent', category, action, name]);
}

var TrackDashboard = {
  mounted: function mounted(el) {
    $('body').on('click', '.widget #close,#minimise,#maximise,#refresh', TrackDashboard_onClick);
  },
  unmounted: function unmounted(el) {
    $('body').off('click', '.widget #close,#minimise,#maximise,#refresh', TrackDashboard_onClick);
  }
};
/* harmony default export */ var TrackDashboard_TrackDashboard = (TrackDashboard);
external_CoreHome_["Matomo"].on('Dashboard.Dashboard.mounted', function (_ref) {
  var element = _ref.element;
  TrackDashboard.mounted(element);
});
external_CoreHome_["Matomo"].on('Dashboard.Dashboard.unmounted', function (_ref2) {
  var element = _ref2.element;
  TrackDashboard.unmounted(element);
});
// CONCATENATED MODULE: ./plugins/AnonymousPiwikUsageMeasurement/vue/src/TrackDashboard/TrackDashboardAction.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */


var TrackDashboardAction_window = window,
    TrackDashboardAction_$ = TrackDashboardAction_window.$;
var TrackDashboardAction = {
  mounted: function mounted(el) {
    TrackDashboardAction_$(el).on('click', '[data-action]', function onClick() {
      var category = 'Dashboard';
      var name = 'WidgetSelector';
      var action = TrackDashboardAction_$(this).attr('data-action');

      window._paq.push(['trackEvent', category, action, name]);
    });
  }
};
/* harmony default export */ var TrackDashboard_TrackDashboardAction = (TrackDashboardAction);
external_CoreHome_["Matomo"].on('Dashboard.DashboardSettings.mounted', function (element) {
  TrackDashboardAction.mounted(element);
});
// CONCATENATED MODULE: ./plugins/AnonymousPiwikUsageMeasurement/vue/src/TrackEmailReports/TrackEmailReports.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */


var TrackEmailReports_window = window,
    TrackEmailReports_$ = TrackEmailReports_window.$;
var TrackEmailReports = {
  mounted: function mounted(el) {
    TrackEmailReports_$(el).on('click', '[name=linkDownloadReport]', function onClick() {
      var id = parseInt(TrackEmailReports_$(this).attr('id'), 10);
      var url = TrackEmailReports_$(this).closest('td').children('form').attr('action');
      var format = external_CoreHome_["MatomoUrl"].parse(url.split('?')[1] || '').format || 'xml'; // avoid tracking large ids to make sure nobody can identify a specific Piwik instance based
      // on that

      id = id % 20; // eslint-disable-line operator-assignment

      var domain = window.piwikUsageTracking.trackingDomain;
      var sourceUrl = "".concat(domain, "/scheduledreports/emailreport").concat(id, ".").concat(format);
      var linkType = 'download';

      window._paq.push(['trackLink', sourceUrl, linkType]);
    });
  }
};
/* harmony default export */ var TrackEmailReports_TrackEmailReports = (TrackEmailReports);
external_CoreHome_["Matomo"].on('ScheduledReports.ManageScheduledReport.mounted', function (_ref) {
  var element = _ref.element;
  TrackEmailReports.mounted(element);
});
// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");

// CONCATENATED MODULE: ./plugins/AnonymousPiwikUsageMeasurement/vue/src/TrackMarketplace/TrackMarketplace.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */



var TrackMarketplace_window = window,
    TrackMarketplace_$ = TrackMarketplace_window.$;

function makeContentBlock($element, pluginName, contentPiece, target) {
  $element.attr('data-track-content', '');
  $element.attr('data-content-name', pluginName);
  $element.attr('data-content-piece', contentPiece);
  $element.attr('data-content-target', target);
}

var TrackMarketplace = {
  mounted: function mounted() {
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["nextTick"])(function () {
      TrackMarketplace_$('.marketplace').find('.plugin').each(function (index, plugin) {
        var $plugin = TrackMarketplace_$(plugin);
        var pluginName = $plugin.find('[matomo-plugin-name]').attr('matomo-plugin-name') || '';
        var header = $plugin.find('.card-title');
        makeContentBlock(header, pluginName, 'Headline', 'popover');
        var body = $plugin.find('.description');
        makeContentBlock(body, pluginName, 'Body', 'popover');
        var footer = $plugin.find('.footer');
        makeContentBlock(footer, pluginName, 'Install', 'self');
      });
      var checkOnScroll = true;
      var timeInterval = 0; // disable for better performance

      window._paq.push(['trackVisibleContentImpressions', checkOnScroll, timeInterval]);
    });
  }
};
/* harmony default export */ var TrackMarketplace_TrackMarketplace = (TrackMarketplace);
external_CoreHome_["Matomo"].on('Marketplace.Marketplace.mounted', function () {
  TrackMarketplace.mounted();
});
// CONCATENATED MODULE: ./plugins/AnonymousPiwikUsageMeasurement/vue/src/TrackMultiSites/TrackMultiSites.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */


var TrackMultiSites_window = window,
    TrackMultiSites_$ = TrackMultiSites_window.$;
var TrackMultiSites = {
  mounted: function mounted(el) {
    TrackMultiSites_$(el).on('click', '[target=_blank]', function onClick() {
      // append ID to not have only one link in report, this way we know the position of the
      // clicked outlink
      var id = TrackMultiSites_$(this).parents('tr').first().prevAll().length + 1;
      var sourceUrl = "".concat(window.piwikUsageTracking.exampleDomain, "/multisites/outlink").concat(id);
      var linkType = 'link';

      window._paq.push(['trackLink', sourceUrl, linkType]);
    });
  }
};
/* harmony default export */ var TrackMultiSites_TrackMultiSites = (TrackMultiSites);
external_CoreHome_["Matomo"].on('MultiSites.MultiSitesSite.mounted', function (_ref) {
  var element = _ref.element;
  TrackMultiSites.mounted(element);
});
// CONCATENATED MODULE: ./plugins/AnonymousPiwikUsageMeasurement/vue/src/TrackSegment/TrackSegment.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */


var TrackSegment_window = window,
    TrackSegment_$ = TrackSegment_window.$;

function trackEvent(action) {
  var category = 'Segments';
  var name = 'SegmentEditor';
  return function () {
    window._paq.push(['trackEvent', category, action, name]);
  };
}

var TrackSegment = {
  mounted: function mounted(el) {
    var element = TrackSegment_$(el);
    element.on('click', '[data-idsegment]', trackEvent('Select a segment'));
    element.on('mousedown', '.add_new_segment', trackEvent('Add new segment'));
    element.on('mousedown', '.saveAndApply', trackEvent('Save'));
    element.on('mousedown', '.delete', trackEvent('Delete'));
  }
};
/* harmony default export */ var TrackSegment_TrackSegment = (TrackSegment);
external_CoreHome_["Matomo"].on('piwikSegmentationInited', function () {
  TrackSegment.mounted(TrackSegment_$('.segmentListContainer .segmentEditorPanel')[0]);
});
// CONCATENATED MODULE: ./plugins/AnonymousPiwikUsageMeasurement/vue/src/index.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */






// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js




/***/ })

/******/ });
});
//# sourceMappingURL=AnonymousPiwikUsageMeasurement.umd.js.map