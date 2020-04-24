/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Setup content tracking for email reports
 * Usage:
 * <div class="emailReports">
 *     <div name="linkDownloadReport">...</div>
 *     <div name="linkDownloadReport">...</div>
 *     ...
 * </div>
 */
(function () {
    angular.module('piwikApp').directive('emailReports', piwikEmailReports);

    piwikEmailReports.$inject = [];

    function piwikEmailReports(){
        return {
            restrict: 'C',
            link: function (scope, element, attrs, ngModel) {

                element.on('click', '[name=linkDownloadReport]', function () {
                    var id = $(this).attr('id');
                    var url = $(this).attr('href');
                    var format = broadcast.getValueFromUrl('format', url);
                    if (!format) {
                        format = 'xml';
                    }
                    id = id % 20; // avoid tracking large ids to make sure nobody can identify a specific Piwik instance based on that

                    var sourceUrl = piwikUsageTracking.trackingDomain + '/scheduledreports/emailreport' + id + '.' + format;
                    var linkType = 'download';

                    _paq.push(['trackLink', sourceUrl, linkType]);
                });
            }
        };
    }
})();