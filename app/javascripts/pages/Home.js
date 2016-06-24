// (c) Andrew Wei

import _ from 'lodash';
import { dom, enums, events, ui, utils } from 'requiem';
import 'gsap';

const DirtyType = enums.DirtyType;
const EventType = enums.EventType;
const EventTimer = events.EventTimer;

class Home extends ui.Element() {
  /** @inheritdoc */
  static get tag() { return 'page-home'; }

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
    if (this.isDirty(enums.DirtyType.STATE)) {
      const playground = this.getChild('playground');
      if (playground) playground.paused = (this.state !== 'active');
    }

    super.update();
  }

  in(done) {
    let nameCard = this.getChild('name-card');

    this.state = 'active';
    this.timeline = new TimelineLite();
    this.timeline.add(TweenLite.to(this, .8, { z: 0, opacity: 1, ease: 'Expo.easeOut' }));
    this.timeline.add(() => {
      dom.setState(nameCard, 'active');
      if (done) done();
    });
  }

  out(done) {
    if (this.state !== 'none') {
      let nameCard = this.getChild('name-card');
      dom.setState(nameCard, 'active');

      this.timeline = new TimelineLite();
      this.timeline.add(TweenLite.to(this, .8, { z: -600, opacity: .1, ease: 'Expo.easeOut' }));
      this.timeline.add(() => {
        if (done) done();
        this.state = 'none';
      });
    }
    else {
      if (done) done();
    }
  }
}

export default Home;
