// (c) Andrew Wei

import { ui } from 'requiem';

class Page extends ui.Element() {
  /** @inheritdoc */
  static get tag() { return 'page'; }

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
  destroy() {
    this.timeline.kill();
    super.destroy();
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
}

export default Page;
