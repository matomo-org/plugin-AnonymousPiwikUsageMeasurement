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
    $(el).click(() => {
      const category = 'Dashboard';
      const name = 'WidgetSelector';
      const action = $(el).attr('data-action');

      window._paq.push(['trackEvent', category, action, name]);
    });
  },
};
