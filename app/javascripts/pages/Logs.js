// (c) Andrew Wei

import { dom, enums, events, ui, utils } from 'requiem';
import 'gsap';

class Logs extends ui.Element() {
  /** @inheritdoc */
  static get tag() { return 'page-logs'; }

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
    let entries = this.getChild('entry');

    this.timeline = new TimelineLite();
    if (entries && entries.length) {
      entries.forEach(entry => {
        this.timeline.add(TweenLite.to(entry, .2, { opacity: 1, y: 0, ease: 'Expo.easeOut' }), `-=${.13}`);
      });
    }
    this.timeline.add(() => {
      if (done) done();
    });
  }

  out(done) {
    let entries = this.getChild('entry');

    this.timeline = new TimelineLite();
    if (entries && entries.length) {
      entries.forEach(entry => {
        this.timeline.add(TweenLite.to(entry, .2, { opacity: 0, y: 100, ease: 'Expo.easeInOut' }), `-=${.15}`);
      });
    }
    this.timeline.add(() => {
      if (done) done();
    });
  }
}

export default Logs;
