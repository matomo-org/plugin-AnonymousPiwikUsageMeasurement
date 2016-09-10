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
    angular.module('piwikApp').directive('piwikDashboard', piwikWidgetId);

    piwikWidgetId.$inject = ['$timeout'];

    function piwikWidgetId($timeout){

        return {
            restrict: 'A',
            priority: 20,
            link: function (scope, element, attrs, ngModel) {

                $(element).on('click', '#close,#minimise,#maximise,#refresh', function () {

                    var $widget = $(this);

                    if (!$widget.parents('.sortable').size()) {
                        return;
                    }

                    var category = 'Dashboard';
                    var name     = 'Widget';
                    var action   = $(this).attr('id');
                    _paq.push(['trackEvent', category, action, name]);
                });

            }
        };
    }
})();

/**
 * Usage:
 * <div data-action="createDashboard">
 */
(function () {
    angular.module('piwikApp').directive('action', piwikDataAction);

    piwikDataAction.$inject = [];

    function piwikDataAction(){

        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {

                element.click(function () {
                    var category = 'Dashboard';
                    var name     = 'WidgetSelector';
                    var action   = $(this).attr('data-action');
                    _paq.push(['trackEvent', category, action, name]);
                });
            }
        };
    }
})();