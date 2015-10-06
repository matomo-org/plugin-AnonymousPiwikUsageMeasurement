/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Setup content tracking for marketplace
 * Usage:
 * <div class="marketplace">
 *     <div class="plugin">...</div>
 *     <div class="plugin">...</div>
 *     ...
 * </div>
 */
(function () {
    angular.module('piwikApp').directive('marketplace', piwikWidgetId);

    piwikWidgetId.$inject = [];

    function piwikWidgetId(){
        return {
            restrict: 'C',
            link: function (scope, element, attrs, ngModel) {

                function makeContentBlock($element, pluginName, contentPiece, target)
                {
                    $element.attr('data-track-content', '');
                    $element.attr('data-content-name', pluginName);
                    $element.attr('data-content-piece', contentPiece);
                    $element.attr('data-content-target', 'popover');
                }

                element.find('.plugin').each(function (index, plugin) {
                    var $plugin    = $(plugin);
                    var pluginName = $plugin.find('[data-pluginname]').attr('data-pluginname');

                    var header = $plugin.find('.panel-heading');
                    makeContentBlock(header, pluginName, 'Headline', 'popover');

                    var body = $plugin.find('.panel-body');
                    makeContentBlock(body, pluginName, 'Body', 'popover');

                    var footer = $plugin.find('.panel-footer');
                    makeContentBlock(footer, pluginName, 'Install', 'self');
                });

                var checkOnScroll = true;
                var timeInterval = 0; // disable for better performance
                _paq.push(['trackVisibleContentImpressions', checkOnScroll, timeInterval]);
            }
        };
    }
})();