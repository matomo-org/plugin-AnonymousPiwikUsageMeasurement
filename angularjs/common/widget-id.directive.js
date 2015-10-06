/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Setup event tracking for dashboard
 *
 * Usage:
 * <div widget-id>
 */
(function () {
    angular.module('piwikApp').directive('widgetid', piwikWidgetId);

    piwikWidgetId.$inject = [];

    function piwikWidgetId(){

        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {

                var $widget = $(element);

                if (!$widget.hasClass('sortable')) {
                    return;
                }

                $widget.find('#close,#minimise,#maximise,#refresh').click(function () {
                    var category = 'Dashboard';
                    var name     = 'Widget';
                    var action   = $(this).attr('id');
                    _paq.push(['trackEvent', category, action, name]);
                });
            }
        };
    }
})();