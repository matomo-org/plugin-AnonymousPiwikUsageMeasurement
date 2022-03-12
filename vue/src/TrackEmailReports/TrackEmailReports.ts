/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */

import { MatomoUrl } from 'CoreHome';
import '../types';

const { $ } = window;

export default {
  mounted(el: HTMLElement): void {
    $(el).on('click', '[name=linkDownloadReport]', function onClick() {
      let id = parseInt($(this).attr('id')!, 10);
      const url = $(this).attr('href')!;
      const format = MatomoUrl.parse((new URL(url)).search.substring(1)).format as string || 'xml';

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
