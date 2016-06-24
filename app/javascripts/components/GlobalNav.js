// (c) Andrew Wei

import { dom, enums, events, ui, utils } from 'requiem';
import Hammer from 'hammerjs';

class GlobalNav extends ui.Element() {
  /** @inheritdoc */
  static get tag() { return 'global-nav'; }

  /** @inheritdoc */
  static get extends() { return 'nav'; }

  /**
   * Specifies whether nav is locked.
   *
   * @type {boolean}
   */
  get locked() { return this.__private__.locked; }
  set locked(val) { this.__private__.locked = val; }

  /**
   * Hammer instance.
   *
   * @return {Hammer}
   */
  get hammer() {
    if (this.__private__.hammer) return this.__private__.hammer;
    this.__private__.hammer = new Hammer(document);
    return this.__private__.hammer;
  }

  /** @inheritdoc */
  init() {
    this.respondsTo(enums.EventType.OBJECT.SCROLL, enums.EventType.MISC.WHEEL);
    this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    this.hammer.on('swipe', event => { this.processInput(event); });
    super.init();
  }

  /** @inheritdoc */
  destroy() {
    this.hammer.off('swipe');
    super.destroy();
  }

  /** @inheritdoc */
  update() {
    if (this.isDirty(enums.DirtyType.INPUT)) this.processInput();
    super.update();
  }

  /**
   * Hander invoked when user input is detected.
   *
   * @param  {Event} [event]
   */
  processInput(event) {
    if (this.locked) return;

    // Check if at top of the page.
    const vrect = utils.getViewportRect();
    const threshold = 2;
    const home = dom.getChild('home');
    const page = dom.getChild('page');

    let direction = 'neutral';

    if ((_.get(event, 'direction') === Hammer.DIRECTION_UP) || (_.get(this.updateDelegate.mouse, 'wheelY') > threshold)) direction = 'up';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_DOWN) || (_.get(this.updateDelegate.mouse, 'wheelY') < threshold*-1)) direction = 'down';

    switch (direction) {
      case 'up':
      case 'down':
        this.locked = true;
        events.EventTimer.addEvent('unlock', () => { this.locked = false; }, 500);

        if (direction === 'up') {
          switch (this.state) {
            case 'home':
              this.getChild('logs-button').click();
              break;
          }
        }
        else {
          switch (this.state) {
            case 'logs':
              if (utils.getRect(page).top >= 0)
                this.getChild('home-button').click();
              break;
          }
        }
        break;
      default:
        // Do nothing
    }
  }
}

export default GlobalNav;
