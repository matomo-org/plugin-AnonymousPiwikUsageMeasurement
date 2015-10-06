/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Setup content tracking for multisites
 * <div class="multisites-label">
 *     <div class="plugin">...</div>
 *     <div class="plugin">...</div>
 *     ...
 * </div>
 */
(function () {
    angular.module('piwikApp').directive('piwikMultisitesSite', piwikMultisitesLabel);

    piwikMultisitesLabel.$inject = [];

    function piwikMultisitesLabel(){
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {

                element.on('click', '[target=_blank]', function () {
                    // append ID to not have only one link in report, this way we know the position of the clicked outlink
                    var id = $(this).parents('tr').first().prevAll().size() + 1;
                    var sourceUrl = urlAnonymizer.exampleDomain + '/multisites/outlink' + id;
                    var linkType = 'link';

                    _paq.push(['trackLink', sourceUrl, linkType]);
                });
            }
        };
    }
})();