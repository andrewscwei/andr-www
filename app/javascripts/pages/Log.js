import anime from 'animejs';
import m, { dom, DirtyType } from 'meno';
import Page from './Page';
import { getRect, getIntersectRect } from 'spase';

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
      const scroll = { y: this.scrollTop };

      anime({
        targets: scroll,
        y: 0,
        duration: 350,
        easing: `easeInOutCubic`,
        update: () => {
          this.scrollTop = scroll.y;
        }
      });
    });

    const nodes = this.querySelectorAll(FADE_IN_ELEMENT_SELECTOR);
    anime({ targets: nodes, duration: 0, opacity: 0, translateX: 0, translateY: 60, translateZ: 0 });

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
          anime({ targets: node, duration: 300, opacity: 1, translateX: 0, translateY: 0, translateZ: 0, easing: `easeOutExpo`, delay: (d++)*100 });
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

    this.timeline = anime.timeline();
    if (contents) this.timeline.add({ targets: contents, duration: 0, translateY: [100, 0], opacity: [0, 1] });
    if (footer) this.timeline.add({ targets: footer, duration: 0, translateY: [100, 0], opacity: [0, 1] });
    if (related) this.timeline.add({ targets: related, duration: 0, translateY: [100, 0], opacity: [0, 1] });
    if (cover) this.timeline.add({ targets: cover, duration: 1000, translateZ: [-300, 0], opacity: [0, 1], easing: `easeOutExpo` });
    if (title) this.timeline.add({ targets: title, duration: 300, translateY: [40, 0], opacity: [0, 1], easing: `easeOutExpo`, offset: `-=200` });
    if (date) this.timeline.add({ targets: date, duration: 300, translateY: [40, 0], opacity: [0, 1], easing: `easeOutExpo`, offset: `-=200` });
    if (tags) this.timeline.add({ targets: tags, duration: 300, translateY: [40, 0], opacity: [0, 1], easing: `easeOutExpo`, offset: `-=200` });
    this.timeline.complete = () => { if (done) done(); };
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

    this.timeline = anime.timeline();
    if (contents) this.timeline.add({ targets: contents, duration: 300, translateY: 100, opacity: 0, easing: `easeInExpo` });
    if (footer) this.timeline.add({ targets: footer, duration: 300, translateY: 100, opacity: 0, easing: `easeInExpo`, offset: `-=300` });
    if (related) this.timeline.add({ targets: related, duration: 300, translateY: 100, opacity: 0, easing: `easeInExpo`, offset: `-=300` });
    if (title) this.timeline.add({ targets: title, duration: 300, translateY: 40, opacity: 0, easing: `easeInExpo`, offset: `-=300` });
    if (date) this.timeline.add({ targets: date, duration: 300, translateY: 40, opacity: 0, easing: `easeInExpo`, offset: `-=200` });
    if (tags) this.timeline.add({ targets: tags, duration: 300, translateY: 40, opacity: 0, easing: `easeInExpo`, offset: `-=200` });
    if (cover) this.timeline.add({ targets: cover, duration: 300, translateZ: -300, opacity: 0, easing: `easeInExpo` });
    this.timeline.complete = () => { if (done) done(); };
  }
}

m.register(Log);

export default Log;
