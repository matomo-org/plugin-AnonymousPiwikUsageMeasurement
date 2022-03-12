/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */

import '../types';

const { $ } = window;

export default {
  mounted(el: HTMLElement): void {
    $(el).on('click', '[target=_blank]', function onClick() {
      // append ID to not have only one link in report, this way we know the position of the
      // clicked outlink
      const id = $(this).parents('tr').first().prevAll().length + 1;
      const sourceUrl = `${window.piwikUsageTracking.exampleDomain}/multisites/outlink${id}`;
      const linkType = 'link';

      window._paq.push(['trackLink', sourceUrl, linkType]);
    });
  },
};
