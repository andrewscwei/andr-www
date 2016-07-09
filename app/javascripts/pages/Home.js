// (c) Andrew Wei

import { dom, enums } from 'requiem';
import Page from './Page';
import 'gsap';

class Home extends Page {
  /** @inheritdoc */
  static get tag() { return 'page-home'; }

  /** @inheritdoc */
  update() {
    if (this.isDirty(enums.DirtyType.STATE|enums.DirtyType.INPUT)) {
      const playground = this.getChild('playground');
      if (playground) playground.paused = (this.state !== 'active');
      this.locked = this.state !== 'active';
    }

    super.update();
  }

  /** @inheritdoc */
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

  /** @inheritdoc */
  out(done) {
    if (this.state !== 'none') {
      this.state = 'none';
      let nameCard = this.getChild('name-card');
      dom.setState(nameCard, 'active');

      this.timeline = new TimelineLite();
      this.timeline.add(TweenLite.to(this, .8, { z: -600, opacity: .1, ease: 'Expo.easeOut' }));
      this.timeline.add(() => { if (done) done(); });
    }
    else {
      if (done) done();
    }
  }
}

export default Home;
