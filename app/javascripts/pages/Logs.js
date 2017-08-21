// © Andrew Wei

import { dom, ui } from 'requiem';
import Page from './Page';
import 'gsap';

class Logs extends Page {
  /** @inheritdoc */
  static get tag() { return 'page-logs'; }

  /** @inheritdoc */
  in(done) {
    let entries = this.getChild('entry');
    let paginator = dom.getChild('paginator');
    let tags = this.getChild('tags');

    if (entries && !(entries instanceof Array)) entries = [].concat(entries);

    this.timeline = new TimelineLite();
    if (paginator)
      this.timeline.add(TweenLite.to(paginator, .2, { y: 0, opacity: 1, ease: 'Expo.easeOut' }));
    if (tags)
      this.timeline.add(TweenLite.to(tags, .2, { y: 0, opacity: 1, ease: 'Expo.easeOut' }));
    if (entries && entries.length) {
      entries.forEach(entry => {
        this.timeline.add(TweenLite.to(entry, .2, { opacity: 1, y: 0, ease: 'Expo.easeOut' }), `-=${.13}`);
      });
    }
    this.timeline.add(() => {
      if (done) done();
    });
  }

  /** @inheritdoc */
  out(done) {
    let entries = this.getChild('entry');
    let paginator = dom.getChild('paginator')
    let tags = this.getChild('tags');

    if (entries && !(entries instanceof Array)) entries = [].concat(entries);

    this.timeline = new TimelineLite();
    if (paginator)
      this.timeline.add(TweenLite.to(paginator, .2, { y: 100, opacity: 0, ease: 'Expo.easeOut' }));
    if (tags)
      this.timeline.add(TweenLite.to(tags, .2, { y: -20, opacity: 0, ease: 'Expo.easeOut' }));
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
