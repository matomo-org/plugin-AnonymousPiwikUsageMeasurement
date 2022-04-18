/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */

import { MatomoUrl, Matomo } from 'CoreHome';
import '../types';

const { $ } = window;

const TrackEmailReports = {
  mounted(el: HTMLElement): void {
    $(el).on('click', '[name=linkDownloadReport]', function onClick() {
      let id = parseInt($(this).attr('id')!, 10);
      const url = $(this).closest('td').children('form').attr('action')!;
      const format = MatomoUrl.parse(url.split('?')[1] || '').format as string || 'xml';

      // avoid tracking large ids to make sure nobody can identify a specific Piwik instance based
      // on that
      id = id % 20; // eslint-disable-line operator-assignment

      const domain = window.piwikUsageTracking.trackingDomain;
      const sourceUrl = `${domain}/scheduledreports/emailreport${id}.${format}`;
      const linkType = 'download';

      window._paq.push(['trackLink', sourceUrl, linkType]);
    });
  },
};

export default TrackEmailReports;

Matomo.on(
  'ScheduledReports.ManageScheduledReport.mounted',
  ({ element }: { element: HTMLElement }) => {
    TrackEmailReports.mounted(element);
  },
);
