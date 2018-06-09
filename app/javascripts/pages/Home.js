import anime from 'animejs';
import m, { dom, DirtyType } from 'meno';
import Page from './Page';

class Home extends Page {
  /** @inheritdoc */
  static get tag() { return `page-home`; }

  get defaults() {
    return {
      state: {
        value: `none`,
        attributed: true,
        dirtyType: DirtyType.STATE
      }
    };
  }

  /** @inheritdoc */
  update(info) {
    if (this.isDirty(DirtyType.STATE|DirtyType.INPUT)) {
      const playground = this.getChild(`playground`);
      if (playground) playground.paused = (this.data.state !== `active`);
      this.locked = this.data.state !== `active`;
    }

    super.update(info);
  }

  /** @inheritdoc */
  in(done) {
    let nameCard = this.getChild(`name-card`);

    this.data.state = `active`;
    this.timeline = anime.timeline();
    this.timeline.add({ targets: this, duration: 800, translateZ: 0, opacity: 1, easing: `easeOutExpo` });
    this.timeline.complete = () => {
      dom.setAttribute(nameCard, `data-state`, `active`);
      if (done) done();
    };

  }

  /** @inheritdoc */
  out(done) {
    if (this.data.state !== `none`) {
      this.data.state = `none`;
      let nameCard = this.getChild(`name-card`);
      dom.setAttribute(nameCard, `data-state`, `active`);
      this.timeline = anime.timeline();
      this.timeline.add({ targets: this, duration: 800, translateZ: -600, opacity: .3, easing: `easeOutExpo` });
      this.timeline.complete = () => { if (done) done(); };
    }
    else {
      dom.setAttribute(this.getChild(`name-card`), `data-state`, `active`);
      anime({ targets: this, duration: 0, translateZ: -600, opacity: .3, easing: `easeOutExpo` });
      if (done) done();
    }
  }
}

export default m.register(Home);
