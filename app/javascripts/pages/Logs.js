// (c) Andrew Wei

import { dom, enums, events, ui, utils } from 'requiem';
import Hammer from 'hammerjs';
import 'gsap';

const DirtyType = enums.DirtyType;
const EventType = enums.EventType;
const EventTimer = events.EventTimer;

class Logs extends ui.Element() {
  static get tag() { return 'page-logs'; }
  static get extends() { return 'div'; }

  init() {
    this.respondsTo(EventType.OBJECT.SCROLL, EventType.MISC.WHEEL);

    this.hammer = new Hammer(this);
    this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    this.hammer.on('swipe', (event) => { this.processInput(event); });

    super.init();
  }

  destroy() {
    this.hammer.off('swipe');
    this.hammer = undefined;

    super.destroy();
  }

  update() {
    if (this.isDirty(DirtyType.INPUT)) {
      this.processInput();
    }

    super.update();
  }

  processInput(event) {
    if (!event && Math.abs(_.get(this.updateDelegate.mouse, 'wheelY')) < 20) return;
    if (this.inputLock) return;

    // Check if at top of the page.
    const vrect = utils.getViewportRect();
    const shouldChangePage = (_.get(event, 'direction') === Hammer.DIRECTION_DOWN) || (_.get(this.updateDelegate.mouse, 'wheelY') < 2);

    this.inputLock = true;
    EventTimer.addEvent('unlock-input', () => { this.inputLock = false; }, 1000);

    if (shouldChangePage) {
      this.toLab();
    }
  }

  toLab() {
    dom.getChild('global-nav.lab-button').click();
  }

  in(done) {
    if (done) done();
  }

  out(done) {
    if (done) done();
  }
}

export default Logs;
