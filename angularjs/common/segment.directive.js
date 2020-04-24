/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Setup content tracking for marketplace
 * Usage:
 * <div class="segmentEditorPanel">
 *     <div data-idsegment="1">...</div>
 *     <div data-idsegment="2">...</div>
 *     <div class="add_new_segment">...</div>
 *     <div class="saveAndApply">...</div>
 *     <div class="delete">...</div>
 * </div>
 */
(function () {
    angular.module('piwikApp').directive('segmentEditorPanel', piwikSegment);

    piwikSegment.$inject = [];

    function piwikSegment(){
        return {
            restrict: 'C',
            link: function (scope, element, attrs, ngModel) {

                function trackEvent(action) {
                    var category = 'Segments';
                    var name = 'SegmentEditor';

                    return function () {
                        _paq.push(['trackEvent', category, action, name]);
                    };
                }

                element.on('click', '[data-idsegment]', trackEvent('Select a segment'));
                element.on('mousedown', '.add_new_segment', trackEvent('Add new segment'));
                element.on('mousedown', '.saveAndApply', trackEvent('Save'));
                element.on('mousedown', '.delete', trackEvent('Delete'));
            }
        };
    }
})();