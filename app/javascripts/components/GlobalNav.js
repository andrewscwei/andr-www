// (c) Andrew Wei

import { dom, enums, events, ui, utils } from 'requiem';
import Hammer from 'hammerjs';
import 'gsap';

const INPUT_DELAY = 200;

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
    this.__private__.hammer = new Hammer(document);
    return this.__private__.hammer;
  }

  /** @inheritdoc */
  init() {
    this.respondsTo(10.0, enums.EventType.OBJECT.SCROLL, enums.EventType.MISC.WHEEL, enums.EventType.KEYBOARD.KEY_UP);
    this.hammer.on('swipe', event => { this.processInput(event); });
    super.init();
  }

  /** @inheritdoc */
  destroy() {
    this.hammer.off('swipe');
    this.timeline.kill();
    super.destroy();
  }

  /** @inheritdoc */
  update() {
    if (this.isDirty(enums.DirtyType.INPUT)) this.processInput();
    super.update();
  }

  /** @inheritdoc */
  in(done) {
    const duration = .2;

    this.timeline = new TimelineLite();
    if (this.getChild('home-button')) this.timeline.add(TweenLite.to(this.getChild('home-button'), duration, { y: 0, ease: 'Expo.easeOut' }));
    if (this.getChild('up-button')) this.timeline.add(TweenLite.to(this.getChild('up-button'), duration, { rotationX: 0, ease: 'Expo.easeOut' }));
    if (this.getChild('right-button')) this.timeline.add(TweenLite.to(this.getChild('right-button'), duration, { x: 0, ease: 'Expo.easeOut' }));
    if (this.getChild('down-button')) this.timeline.add(TweenLite.to(this.getChild('down-button'), duration, { rotationX: 0, ease: 'Expo.easeOut' }));
    if (this.getChild('left-button')) this.timeline.add(TweenLite.to(this.getChild('left-button'), duration, { x: 0, ease: 'Expo.easeOut' }));
    this.timeline.add(() => { if (done) done(); });
  }

  /** @inheritdoc */
  out(done) {
    const duration = .2;

    this.timeline = new TimelineLite();
    if (this.getChild('home-button')) this.timeline.add(TweenLite.to(this.getChild('home-button'), duration, { y: -100, ease: 'Expo.easeOut' }));
    if (this.getChild('up-button')) this.timeline.add(TweenLite.to(this.getChild('up-button'), duration, { rotationX: 90, ease: 'Expo.easeOut' }));
    if (this.getChild('right-button')) this.timeline.add(TweenLite.to(this.getChild('right-button'), duration, { x: 100, ease: 'Expo.easeOut' }));
    if (this.getChild('down-button')) this.timeline.add(TweenLite.to(this.getChild('down-button'), duration, { rotationX: -90, ease: 'Expo.easeOut' }));
    if (this.getChild('left-button')) this.timeline.add(TweenLite.to(this.getChild('left-button'), duration, { x: -100, ease: 'Expo.easeOut' }));
    this.timeline.add(() => { if (done) done(); });
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
    const rect = page ? utils.getRect(page) : undefined;

    let direction = 'neutral';

    if ((_.get(event, 'direction') === Hammer.DIRECTION_UP) || (_.get(this.updateDelegate.mouse, 'wheelY') > threshold) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.DOWN_ARROW))) direction = 'up';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_DOWN) || (_.get(this.updateDelegate.mouse, 'wheelY') < threshold*-1) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.UP_ARROW))) direction = 'down';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_LEFT) || (_.get(this.updateDelegate.mouse, 'wheelX') > threshold) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.RIGHT_ARROW))) direction = 'left';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_RIGHT) || (_.get(this.updateDelegate.mouse, 'wheelX') < threshold*-1) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.LEFT_ARROW))) direction = 'right';

    if (direction !== 'neutral') {
      this.locked = true;
      events.EventTimer.addEvent('unlock', () => { this.locked = false; }, INPUT_DELAY);
    }

    switch (direction) {
      case 'up':
        if ((!rect || ((rect.height + rect.top - vrect.height) <= 0)) && this.getChild('down-button'))
          this.getChild('down-button').click();
        break;
      case 'down':
        if ((!rect || (rect.top >= 0)) && this.getChild('up-button'))
          this.getChild('up-button').click();
        break;
      case 'right':
        if ((!rect || (rect.left >= 0)) && this.getChild('left-button'))
          this.getChild('left-button').click();
        break;
      case 'left':
        if ((!rect || ((rect.width + rect.left - vrect.width) <= 0)) && this.getChild('right-button'))
          this.getChild('right-button').click();
      default:
        // Do nothing
    }
  }
}

export default GlobalNav;
