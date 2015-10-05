/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Usage:
 * <div piwik-widget-id>
 */
(function () {
    angular.module('piwikApp').directive('widgetid', piwikWidgetId);

    piwikWidgetId.$inject = ['piwik'];

    function piwikWidgetId(piwik){
        var defaults = {
            // showAllSitesItem: 'true'
        };

        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {

                var $widget = $(element);

                if (!$widget.hasClass('sortable')) {
                    return;
                }

                var widgetId = $widget.attr('widgetid');

                if (0 === widgetId.indexOf('widget')) {
                    widgetId = widgetId.substr('widget'.length);
                }
                $widget.attr('data-track-content', '');
                $widget.attr('data-content-name', widgetId);
                $widget.attr('data-content-piece', 'Widget');
                $widget.attr('data-content-ignoreinteraction', ''); // we handle interactions manually

                $widget.find('#close').click(function () {
                    _paq.push(['trackContentInteractionNode', $widget[0], 'Close']);
                });
                $widget.find('#minimise').click(function () {
                    _paq.push(['trackContentInteractionNode', $widget[0], 'Minimise']);
                });
                $widget.find('#maximise').click(function () {
                    _paq.push(['trackContentInteractionNode', $widget[0], 'Maximise']);
                });
                $widget.find('#refresh').click(function () {
                    _paq.push(['trackContentInteractionNode', $widget[0], 'Refresh']);
                });
            }
        };
    }
})();