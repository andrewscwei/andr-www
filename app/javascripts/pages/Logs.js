import anime from 'animejs';
import m, { dom } from 'meno';
import Page from './Page';

class Logs extends Page {
  /** @inheritdoc */
  static get tag() { return `page-logs`; }

  /** @inheritdoc */
  in(done) {
    let entries = this.getChild(`entry`);
    let paginator = dom.getChild(`paginator`);
    let tags = this.getChild(`tags`);

    if (entries && !(entries instanceof Array)) entries = [].concat(entries);

    this.timeline = anime.timeline();
    if (paginator) this.timeline.add({ targets: paginator, duration: 200, translateY: [100, 0], opacity: [0, 1], easing: `easeOutExpo` });
    if (tags) this.timeline.add({ targets: tags, duration: 200, translateY: [-20, 0], opacity: [0, 1], easing: `easeOutExpo` });
    if (entries && entries.length) {
      entries.forEach(entry => {
        this.timeline.add({ targets: entry, duration: 200, opacity: [0, 1], translateY: [100, 0], easing: `easeOutExpo`, offset: `-=${130}` });
      });
    }
    this.timeline.complete = () => {
      if (done) done();
    };
  }

  /** @inheritdoc */
  out(done) {
    let entries = this.getChild(`entry`);
    let paginator = dom.getChild(`paginator`);
    let tags = this.getChild(`tags`);

    if (entries && !(entries instanceof Array)) entries = [].concat(entries);

    this.timeline = anime.timeline();
    if (paginator) this.timeline.add({ targets: paginator, duration: 200, translateY: 100, opacity: 0, easing: `easeOutExpo` });
    if (tags) this.timeline.add({ targets: tags, duration: 200, translateY: -20, opacity: 0, easing: `easeOutExpo` });
    if (entries && entries.length) {
      entries.forEach(entry => {
        this.timeline.add({ targets: entry, duration: 200, opacity: 0, translateY: 100, easing: `easeInOutExpo`, offset: `-=${150}` });
      });
    }
    this.timeline.complete = () => {
      if (done) done();
    };
  }
}

export default m.register(Logs);
