// (c) Andrew Wei

import { dom, enums, ui } from 'requiem';
import Hammer from 'hammerjs';

class Page extends ui.Element() {
  /** @inheritdoc */
  static get tag() { return 'page-base'; }

  /** @inheritdoc */
  static get extends() { return 'div'; }

  /**
   * TimelineLite instance.
   *
   * @type {TimelineLite}
   */
  get timeline() { return this.__private__.timeline; }
  set timeline(val) {
    if (this.__private__.timeline) this.__private__.timeline.kill();
    this.__private__.timeline = val;
  }

  /**
   * Hammer instance.
   *
   * @return {Hammer}
   */
  get hammer() {
    if (this.__private__.hammer) return this.__private__.hammer;
    this.__private__.hammer = new Hammer(this);
    return this.__private__.hammer;
  }

  get direction() {
    let d = 0;
    if (this.getChild('down-button')) d |= Hammer.DIRECTION_UP;
    if (this.getChild('left-button')) d |= Hammer.DIRECTION_RIGHT;
    if (this.getChild('up-button')) d |= Hammer.DIRECTION_DOWN;
    if (this.getChild('right-button')) d |= Hammer.DIRECTION_LEFT;
    return (d === 0) ? Hammer.DIRECTION_NONE : d;
  }

  /**
   * Specifies whether gesture navigation is locked.
   *
   * @type {boolean}
   */
  get locked() { return this.__private__.locked; }
  set locked(val) {
    if (this.__private__.locked === val) return;
    this.__private__.locked = val;

    if (val === false) {
      if (this.getChild('up-button')) this.getChild('up-button').disabled = false;
      if (this.getChild('right-button')) this.getChild('right-button').disabled = false;
      if (this.getChild('down-button')) this.getChild('down-button').disabled = false;
      if (this.getChild('left-button')) this.getChild('left-button').disabled = false;
    }
  }

  /** @inheritdoc */
  init() {
    this.respondsTo(10.0, enums.EventType.MISC.WHEEL);
    this.respondsTo(10.0, enums.EventType.KEYBOARD.KEY_UP);

    if (this.direction !== Hammer.DIRECTION_NONE) {
      this.hammer.get('swipe').set({ direction: this.direction });
      this.hammer.on('swipe', event => { this.processInput(event); });
    }

    super.init();
  }

  /** @inheritdoc */
  destroy() {
    this.hammer.off('swipe');
    if (this.timeline) this.timeline.kill();
    super.destroy();
  }

  /** @inheritdoc */
  update() {
    if (!this.isDirty(enums.DirtyType.ALL) && this.isDirty(enums.DirtyType.INPUT)) this.processInput();
    super.update();
  }

  /**
   * Async method invoked by the PageManager when this page transitions in.
   *
   * @param {Function} done - Callback.
   */
  in(done) {
    if (done) done();
  }

  /**
   * Async method invoked by the PageManager when this page transitions out.
   *
   * @param {Function} done - Callback.
   */
  out(done) {
    if (done) done();
  }

  /**
   * Hander invoked when user input is detected.
   *
   * @param  {Event} [event]
   */
  processInput(event) {
    if (this.locked) return;

    // Check if at top of the page.
    const threshold = 2;

    let direction = 'neutral';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_UP) || (_.get(this.updateDelegate.mouse, 'wheelY') > threshold) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.DOWN_ARROW))) direction = 'up';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_DOWN) || (_.get(this.updateDelegate.mouse, 'wheelY') < threshold*-1) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.UP_ARROW))) direction = 'down';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_LEFT) || (_.get(this.updateDelegate.mouse, 'wheelX') > threshold) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.RIGHT_ARROW))) direction = 'left';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_RIGHT) || (_.get(this.updateDelegate.mouse, 'wheelX') < threshold*-1) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.LEFT_ARROW))) direction = 'right';

    let targetButton = undefined;

    switch (direction) {
      case 'up':
        targetButton = this.getChild('down-button');
        break;
      case 'down':
        targetButton = this.getChild('up-button');
        break;
      case 'right':
        targetButton = this.getChild('left-button');
        break;
      case 'left':
        targetButton = this.getChild('right-button');
        break;
      default:
        // Do nothing
    }

    if (targetButton && !targetButton.disabled) targetButton.click();
  }
}

export default Page;
