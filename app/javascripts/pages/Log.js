import m, { dom, DirtyType } from 'meno';
import getRect from 'meno/lib/utils/getRect';
import getIntersectRect from 'meno/lib/utils/getIntersectRect';
import Page from './Page';
import 'gsap';
import 'gsap/src/uncompressed/plugins/ScrollToPlugin';

const FADE_IN_ELEMENT_SELECTOR = `pre, [name="footer"] [type="button"], [name="related"] [type="button"]`;

class Log extends Page {
  /** @inheritdoc */
  static get tag() { return `page-log`; }

  get responsiveness() {
    return Object.assign(super.responsiveness, {
      'scroll': {
        conductor: this,
        delay: 10.0
      },
      'resize': {
        conductor: this,
        delay: 10.0
      }
    });
  }

  /** @inheritdoc */
  init() {
    this.getChild(`footer.top-button`).addEventListener(`click`, (event) => {
      TweenLite.to(this, .5, { scrollTo: { y: 0 }, ease: `Power2.easeOut` });
    });

    const nodes = this.querySelectorAll(FADE_IN_ELEMENT_SELECTOR);

    for (let i=0, node; node = nodes[i++];) {
      TweenLite.to(node, 0, { opacity: 0, x: 0, y: 60, z: 0 });
    }

    super.init();
  }

  /** @inheritdoc */
  update(info) {
    if (this.isDirty(DirtyType.POSITION|DirtyType.SIZE)) {
      let rect = getRect(document.getElementById(`inner-page`) || this);
      let cover = dom.getChild(`cover`);

      if (rect.top < -100) {
        if (cover) dom.setAttribute(dom.getChild(`cover`), `state`, `hidden`);
      }
      else {
        if (cover) dom.setAttribute(dom.getChild(`cover`), `state`, `none`);
      }

      let nodes = this.querySelectorAll(FADE_IN_ELEMENT_SELECTOR);
      let d = 0;

      for (let i=0, node; node = nodes[i++];) {
        if ((node.nodeType !== Node.ELEMENT_NODE) || (node.tagName.toLowerCase() === `hr`) || (node.isIn)) continue;

        if (getIntersectRect(node).height > 0) {
          node.isIn = true;
          TweenLite.to(node, .3, { opacity: 1, x: 0, y: 0, z: 0, ease: `Expo.easeOut`, delay: (d++)*.1 });
        }
      }
    }

    super.update(info);
  }

  /** @inheritdoc */
  in(done) {
    const cover = dom.getChild(`cover`);
    const title = this.getChild(`header.info.title`);
    const date = this.getChild(`header.info.date`);
    const tags = this.getChild(`header.info.tags`);
    const contents = this.getChild(`contents`);
    const footer = this.getChild(`footer`);
    const related = this.getChild(`footer`);

    this.timeline = new TimelineLite();
    if (contents) this.timeline.add(TweenLite.to(contents, 0, { y: 0, opacity: 1 }));
    if (footer) this.timeline.add(TweenLite.to(footer, 0, { y: 0, opacity: 1 }));
    if (related) this.timeline.add(TweenLite.to(related, 0, { y: 0, opacity: 1 }));
    if (cover) this.timeline.add(TweenLite.to(cover, 1, { z: 0, opacity: 1, ease: `Expo.easeOut` }));
    if (title) this.timeline.add(TweenLite.to(title, .3, { y: 0, opacity: 1, ease: `Expo.easeOut` }), `-=.2`);
    if (date) this.timeline.add(TweenLite.to(date, .3, { y: 0, opacity: 1, ease: `Expo.easeOut` }), `-=.2`);
    if (tags) this.timeline.add(TweenLite.to(tags, .3, { y: 0, opacity: 1, ease: `Expo.easeOut` }), `-=.2`);
    this.timeline.add(() => { if (done) done(); });
  }

  /** @inheritdoc */
  out(done) {
    const cover = dom.getChild(`cover`);
    const title = this.getChild(`header.info.title`);
    const date = this.getChild(`header.info.date`);
    const tags = this.getChild(`header.info.tags`);
    const contents = this.getChild(`contents`);
    const footer = this.getChild(`footer`);
    const related = this.getChild(`related`);

    this.timeline = new TimelineLite();
    if (contents) this.timeline.add(TweenLite.to(contents, .3, { y: 100, opacity: 0, ease: `Expo.easeIn` }));
    if (footer) this.timeline.add(TweenLite.to(footer, .3, { y: 100, opacity: 0, ease: `Expo.easeIn` }), `-=.3`);
    if (related) this.timeline.add(TweenLite.to(related, .3, { y: 100, opacity: 0, ease: `Expo.easeIn` }), `-=.3`);
    if (title) this.timeline.add(TweenLite.to(title, .3, { y: 40, opacity: 0, ease: `Expo.easeIn` }), `-=.3`);
    if (date) this.timeline.add(TweenLite.to(date, .3, { y: 40, opacity: 0, ease: `Expo.easeIn` }), `-=.2`);
    if (tags) this.timeline.add(TweenLite.to(tags, .3, { y: 40, opacity: 0, ease: `Expo.easeIn` }), `-=.2`);
    if (cover) this.timeline.add(TweenLite.to(cover, .3, { z: -300, opacity: 0, ease: `Expo.easeIn` }));
    this.timeline.add(() => { if (done) done(); });
  }
}

m.register(Log);

export default Log;
