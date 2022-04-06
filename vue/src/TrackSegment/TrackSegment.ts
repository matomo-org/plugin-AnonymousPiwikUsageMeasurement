/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/* eslint-disable no-underscore-dangle */

import { Matomo } from 'CoreHome';
import '../types';

const { $ } = window;

function trackEvent(action: string) {
  const category = 'Segments';
  const name = 'SegmentEditor';

  return () => {
    window._paq.push(['trackEvent', category, action, name]);
  };
}

const TrackSegment = {
  mounted(el: HTMLElement): void {
    const element = $(el);
    element.on('click', '[data-idsegment]', trackEvent('Select a segment'));
    element.on('mousedown', '.add_new_segment', trackEvent('Add new segment'));
    element.on('mousedown', '.saveAndApply', trackEvent('Save'));
    element.on('mousedown', '.delete', trackEvent('Delete'));
  },
};

export default TrackSegment;

Matomo.on('piwikSegmentationInited', () => {
  TrackSegment.mounted($('.segmentListContainer .segmentEditorPanel')[0]);
});
