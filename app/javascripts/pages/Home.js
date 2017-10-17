// © Andrew Wei

import m, { dom, DirtyType } from 'meno';
import Page from './Page';
import 'gsap';

class Home extends Page {
  /** @inheritdoc */
  static get tag() { return 'page-home'; }

  get defaults() {
    return {
      state: {
        value: 'none',
        attributed: true,
        dirtyType: DirtyType.STATE
      }
    }
  }

  /** @inheritdoc */
  update(info) {
    if (this.isDirty(DirtyType.STATE|DirtyType.INPUT)) {
      const playground = this.getChild('playground');
      if (playground) playground.paused = (this.data.state !== 'active');
      this.locked = this.data.state !== 'active';
    }

    super.update(info);
  }

  /** @inheritdoc */
  in(done) {
    let nameCard = this.getChild('name-card');

    this.data.state = 'active';
    this.timeline = new TimelineLite();
    this.timeline.add(TweenLite.to(this, .8, { z: 0, opacity: 1, ease: 'Expo.easeOut' }));
    this.timeline.add(() => {
      dom.setAttribute(nameCard, 'data-state', 'active');
      if (done) done();
    });

  }

  /** @inheritdoc */
  out(done) {
    if (this.data.state !== 'none') {
      this.data.state = 'none';
      let nameCard = this.getChild('name-card');
      dom.setAttribute(nameCard, 'data-state', 'active');
      this.timeline = new TimelineLite();
      this.timeline.add(TweenLite.to(this, .8, { z: -600, opacity: .3, ease: 'Expo.easeOut' }));
      this.timeline.add(() => { if (done) done(); });
    }
    else {
      dom.setAttribute(this.getChild('name-card'), 'data-state', 'active');
      TweenLite.to(this, 0, { z: -600, opacity: .3, ease: 'Expo.easeOut' });
      if (done) done();
    }
  }
}

m.register(Home);

export default Home;
