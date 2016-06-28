// (c) Andrew Wei

import { dom, enums, events, ui, utils } from 'requiem';
import 'gsap';

class Log extends ui.Element() {
  /** @inheritdoc */
  static get tag() { return 'page-log'; }

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

  /** @inheritdoc */
  init() {
    super.init();
  }

  /** @inheritdoc */
  destroy() {
    this.timeline.kill();
    super.destroy();
  }

  /** @inheritdoc */
  update() {
    super.update();
  }

  in(done) {
    this.timeline = new TimelineLite();
    this.timeline.add(() => { if (done) done(); });
  }

  out(done) {
    this.timeline = new TimelineLite();
    this.timeline.add(() => { if (done) done(); });
  }
}

export default Log;
