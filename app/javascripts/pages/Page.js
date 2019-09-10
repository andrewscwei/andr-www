import Hammer from 'hammerjs';
import { DirtyType, Element } from 'meno';

if (process.env.NODE_ENV === 'development') {
  var debug = require('debug')('app:Page');
}

class Page extends Element() {
  /**
   * Timeline instance.
   *
   * @type {Timeline}
   */
  get timeline() { return this.get('timeline'); }
  set timeline(val) {
    if (this.timeline) this.timeline.pause();
    this.set('timeline', val);
  }

  /**
   * Hammer instance.
   *
   * @return {Hammer}
   */
  get hammer() { return this.get('hammer', () => (new Hammer(this))); }

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
  get locked() { return this.get('locked', false); }
  set locked(val) { this.setNeedsUpdate('locked', val, DirtyType.STATE); }

  get responsiveness() {
    return {
      wheel: 10.0,
      keyup: 10.0,
    };
  }

  /** @inheritdoc */
  init() {
    if (this.direction !== Hammer.DIRECTION_NONE) {

      if (process.env.NODE_ENV === 'development') {
        debug(`<${this.constructor.name}> Handling direction: ${this.direction}`);
      }

      this.hammer.get('swipe').set({ direction: this.direction });
      this.hammer.on('swipe', event => { this.processInput(event); });
    }
  }

  /** @inheritdoc */
  destroy() {
    this.hammer.off('swipe');
    this.timeline = undefined;
  }

  /** @inheritdoc */
  update(info) {
    this.processInput(undefined, info && info[DirtyType.INPUT]);

    if (this.isDirty(DirtyType.STATE)) {
      if (this.getChild('up-button')) this.getChild('up-button').disabled = this.locked;
      if (this.getChild('right-button')) this.getChild('right-button').disabled = this.locked;
      if (this.getChild('down-button')) this.getChild('down-button').disabled = this.locked;
      if (this.getChild('left-button')) this.getChild('left-button').disabled = this.locked;
    }
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
  processInput(event, info) {
    if (this.locked) return;
    if (!event && !info) return;

    // Check if at top of the page.
    const threshold = 2;

    let direction = 'neutral';

    if (event) {
      if (event.direction === Hammer.DIRECTION_UP) direction = 'up';
      if (event.direction === Hammer.DIRECTION_DOWN) direction = 'down';
      if (event.direction === Hammer.DIRECTION_LEFT) direction = 'left';
      if (event.direction === Hammer.DIRECTION_RIGHT) direction = 'right';

      if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Detected "${direction}" swipe`);
    }
    else if (info) {
      if ((info.mouseWheelY > threshold)    || (info.keyUp && ~info.keyUp.indexOf(40))) direction = 'up';
      if ((info.mouseWheelY < threshold*-1) || (info.keyUp && ~info.keyUp.indexOf(38))) direction = 'down';
      if ((info.mouseWheelX > threshold)    || (info.keyUp && ~info.keyUp.indexOf(39))) direction = 'left';
      if ((info.mouseWheelX < threshold*-1) || (info.keyUp && ~info.keyUp.indexOf(37))) direction = 'right';
    }

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

    if (targetButton) {
      if (!targetButton.disabled) {
        targetButton.click();
      }
      else if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Target button is disabled`);
    }
  }
}

export default Page;
