(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("CoreHome"), require("vue")) : typeof define === "function" && define.amd ? define(["exports", "CoreHome", "vue"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.AnonymousPiwikUsageMeasurement = {}, global.CoreHome, global.Vue));
})(this, (function(exports2, CoreHome, vue) {
  "use strict";
  /*!
   * Matomo - free/libre analytics platform
   *
   * @link https://matomo.org
   * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
   */
  const { $: $$5 } = window;
  function onClick() {
    const $widget = $$5(this);
    if (!$widget.parents(".sortable").length) {
      return;
    }
    const category = "Dashboard";
    const name = "Widget";
    const action = $$5(this).attr("id");
    window._paq.push(["trackEvent", category, action, name]);
  }
  const TrackDashboard = {
    mounted() {
      $$5("body").on("click", ".widget #close,#minimise,#maximise,#refresh", onClick);
    },
    unmounted() {
      $$5("body").off("click", ".widget #close,#minimise,#maximise,#refresh", onClick);
    }
  };
  CoreHome.Matomo.on("Dashboard.Dashboard.mounted", () => {
    TrackDashboard.mounted();
  });
  CoreHome.Matomo.on("Dashboard.Dashboard.unmounted", () => {
    TrackDashboard.unmounted();
  });
  /*!
   * Matomo - free/libre analytics platform
   *
   * @link https://matomo.org
   * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
   */
  const { $: $$4 } = window;
  const TrackDashboardAction = {
    mounted(el) {
      $$4(el).on("click", "[data-action]", function onClick2() {
        const category = "Dashboard";
        const name = "WidgetSelector";
        const action = $$4(this).attr("data-action");
        window._paq.push(["trackEvent", category, action, name]);
      });
    }
  };
  CoreHome.Matomo.on("Dashboard.DashboardSettings.mounted", (element) => {
    TrackDashboardAction.mounted(element);
  });
  /*!
   * Matomo - free/libre analytics platform
   *
   * @link https://matomo.org
   * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
   */
  const { $: $$3 } = window;
  const TrackEmailReports = {
    mounted(el) {
      $$3(el).on("click", "[name=linkDownloadReport]", function onClick2() {
        let id = parseInt($$3(this).attr("id"), 10);
        const url = $$3(this).closest("td").children("form").attr("action");
        const format = CoreHome.MatomoUrl.parse(url.split("?")[1] || "").format || "xml";
        id = id % 20;
        const domain = window.piwikUsageTracking.trackingDomain;
        const sourceUrl = `${domain}/scheduledreports/emailreport${id}.${format}`;
        const linkType = "download";
        window._paq.push(["trackLink", sourceUrl, linkType]);
      });
    }
  };
  CoreHome.Matomo.on(
    "ScheduledReports.ManageScheduledReport.mounted",
    ({ element }) => {
      TrackEmailReports.mounted(element);
    }
  );
  /*!
   * Matomo - free/libre analytics platform
   *
   * @link https://matomo.org
   * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
   */
  const { $: $$2 } = window;
  function makeContentBlock($element, pluginName, contentPiece, target) {
    $element.attr("data-track-content", "");
    $element.attr("data-content-name", pluginName);
    $element.attr("data-content-piece", contentPiece);
    $element.attr("data-content-target", target);
  }
  const TrackMarketplace = {
    mounted() {
      vue.nextTick(() => {
        $$2(".marketplace").find(".plugin").each((index, plugin) => {
          const $plugin = $$2(plugin);
          const pluginName = $plugin.find("[matomo-plugin-name]").attr("matomo-plugin-name") || "";
          const header = $plugin.find(".card-title");
          makeContentBlock(header, pluginName, "Headline", "popover");
          const body = $plugin.find(".description");
          makeContentBlock(body, pluginName, "Body", "popover");
          const footer = $plugin.find(".footer");
          makeContentBlock(footer, pluginName, "Install", "self");
        });
        const checkOnScroll = true;
        const timeInterval = 0;
        window._paq.push(["trackVisibleContentImpressions", checkOnScroll, timeInterval]);
      });
    }
  };
  CoreHome.Matomo.on("Marketplace.Marketplace.mounted", () => {
    TrackMarketplace.mounted();
  });
  /*!
   * Matomo - free/libre analytics platform
   *
   * @link https://matomo.org
   * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
   */
  const { $: $$1 } = window;
  const TrackMultiSites = {
    mounted(el) {
      $$1(el).on("click", "[target=_blank]", function onClick2() {
        const id = $$1(this).parents("tr").first().prevAll().length + 1;
        const sourceUrl = `${window.piwikUsageTracking.exampleDomain}/multisites/outlink${id}`;
        const linkType = "link";
        window._paq.push(["trackLink", sourceUrl, linkType]);
      });
    }
  };
  CoreHome.Matomo.on("MultiSites.MultiSitesSite.mounted", ({ element }) => {
    TrackMultiSites.mounted(element);
  });
  /*!
   * Matomo - free/libre analytics platform
   *
   * @link https://matomo.org
   * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
   */
  const { $ } = window;
  function trackEvent(action) {
    const category = "Segments";
    const name = "SegmentEditor";
    return () => {
      window._paq.push(["trackEvent", category, action, name]);
    };
  }
  const TrackSegment = {
    mounted(el) {
      const element = $(el);
      element.on("click", "[data-idsegment]", trackEvent("Select a segment"));
      element.on("mousedown", ".add_new_segment", trackEvent("Add new segment"));
      element.on("mousedown", ".saveAndApply", trackEvent("Save"));
      element.on("mousedown", ".delete", trackEvent("Delete"));
    }
  };
  CoreHome.Matomo.on("piwikSegmentationInited", () => {
    TrackSegment.mounted($(".segmentListContainer")[0]);
  });
  exports2.TrackDashboard = TrackDashboard;
  exports2.TrackDashboardAction = TrackDashboardAction;
  exports2.TrackEmailReports = TrackEmailReports;
  exports2.TrackMarketplace = TrackMarketplace;
  exports2.TrackMultiSites = TrackMultiSites;
  exports2.TrackSegment = TrackSegment;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
}));
