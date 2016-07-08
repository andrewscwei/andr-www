// (c) Andrew Wei

import { dom, enums, ui, utils } from 'requiem';
import Hammer from 'hammerjs';
import 'gsap';

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
    let target = dom.getChild('page') || dom.getChild('home') || undefined;
    if (target) this.__private__.hammer = new Hammer(target);
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

  /** @inheritdoc */
  init() {
    this.respondsTo(10.0, enums.EventType.MISC.WHEEL);
    this.respondsTo(10.0, enums.EventType.KEYBOARD.KEY_UP);
    this.hammer.get('swipe').set({ direction: this.direction });
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
    if (!this.isDirty(enums.DirtyType.ALL) && this.isDirty(enums.DirtyType.INPUT)) this.processInput();

    super.update();
  }

  /** @inheritdoc */
  in(done) {
    const duration = .2;

    this.timeline = new TimelineLite();
    if (this.getChild('home-button')) this.timeline.add(TweenLite.to(this.getChild('home-button'), duration, { y: 0, ease: 'Expo.easeOut' }));
    if (this.getChild('grid-button')) this.timeline.add(TweenLite.to(this.getChild('grid-button'), duration, { y: 0, ease: 'Expo.easeOut' }));
    if (this.getChild('logs-button')) this.timeline.add(TweenLite.to(this.getChild('logs-button'), duration, { y: 0, ease: 'Expo.easeOut' }));
    this.timeline.add(() => { if (done) done(); });
  }

  /** @inheritdoc */
  out(done) {
    const duration = .2;

    this.timeline = new TimelineLite();
    if (this.getChild('home-button')) this.timeline.add(TweenLite.to(this.getChild('home-button'), duration, { y: -100, ease: 'Expo.easeOut' }));
    if (this.getChild('grid-button')) this.timeline.add(TweenLite.to(this.getChild('grid-button'), duration, { y: -100, ease: 'Expo.easeOut' }));
    if (this.getChild('logs-button')) this.timeline.add(TweenLite.to(this.getChild('logs-button'), duration, { y: 100, ease: 'Expo.easeOut' }));
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
    const inner = document.getElementById('inner-page');
    const rect = (inner && utils.getRect(inner)) || (page && utils.getRect(page)) || undefined;

    let direction = 'neutral';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_UP) || (_.get(this.updateDelegate.mouse, 'wheelY') > threshold) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.DOWN_ARROW))) direction = 'up';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_DOWN) || (_.get(this.updateDelegate.mouse, 'wheelY') < threshold*-1) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.UP_ARROW))) direction = 'down';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_LEFT) || (_.get(this.updateDelegate.mouse, 'wheelX') > threshold) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.RIGHT_ARROW))) direction = 'left';
    if ((_.get(event, 'direction') === Hammer.DIRECTION_RIGHT) || (_.get(this.updateDelegate.mouse, 'wheelX') < threshold*-1) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.LEFT_ARROW))) direction = 'right';

    // if ((_.get(this.updateDelegate.mouse, 'wheelY') > threshold) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.DOWN_ARROW))) direction = 'up';
    // if ((_.get(this.updateDelegate.mouse, 'wheelY') < threshold*-1) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.UP_ARROW))) direction = 'down';
    // if ((_.get(this.updateDelegate.mouse, 'wheelX') > threshold) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.RIGHT_ARROW))) direction = 'left';
    // if ((_.get(this.updateDelegate.mouse, 'wheelX') < threshold*-1) || (this.updateDelegate.keyCode.up && ~this.updateDelegate.keyCode.up.indexOf(enums.KeyCode.LEFT_ARROW))) direction = 'right';

    let targetButton = undefined;

    switch (direction) {
      case 'up':
        if (!rect || ((rect.height + rect.top - vrect.height) <= 0)) targetButton = this.getChild('down-button');
        break;
      case 'down':
        if (!rect || (rect.top >= 0)) targetButton = this.getChild('up-button');
        break;
      case 'right':
        if (!rect || (rect.left >= 0)) targetButton = this.getChild('left-button');
        break;
      case 'left':
        if (!rect || ((rect.width + rect.left - vrect.width) <= 0)) targetButton = this.getChild('right-button');
        break;
      default:
        // Do nothing
    }

    if (targetButton && !targetButton.disabled) targetButton.click();
  }
}

export default GlobalNav;
