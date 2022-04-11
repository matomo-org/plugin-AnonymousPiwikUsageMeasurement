/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */

import { nextTick } from 'vue';
import { Matomo } from 'CoreHome';
import '../types';

const { $ } = window;

function makeContentBlock(
  $element: JQuery,
  pluginName: string,
  contentPiece: string,
  target: string,
) {
  $element.attr('data-track-content', '');
  $element.attr('data-content-name', pluginName);
  $element.attr('data-content-piece', contentPiece);
  $element.attr('data-content-target', target);
}

const TrackMarketplace = {
  mounted(): void {
    nextTick(() => {
      $('.marketplace').find('.plugin').each((index, plugin) => {
        const $plugin = $(plugin);
        const pluginName = $plugin.find('[matomo-plugin-name]').attr('matomo-plugin-name') || '';

        const header = $plugin.find('.card-title');
        makeContentBlock(header, pluginName, 'Headline', 'popover');

        const body = $plugin.find('.description');
        makeContentBlock(body, pluginName, 'Body', 'popover');

        const footer = $plugin.find('.footer');
        makeContentBlock(footer, pluginName, 'Install', 'self');
      });

      const checkOnScroll = true;
      const timeInterval = 0; // disable for better performance
      window._paq.push(['trackVisibleContentImpressions', checkOnScroll, timeInterval]);
    });
  },
};

export default TrackMarketplace;

Matomo.on('Marketplace.Marketplace.mounted', () => {
  TrackMarketplace.mounted();
});
