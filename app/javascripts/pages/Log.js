// (c) Andrew Wei

import { dom, enums, events, ui, utils } from 'requiem';
import 'gsap';

class Log extends ui.Element() {
  /** @inheritdoc */
  static get tag() { return 'page-log'; }

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
    this.respondsTo(document.getElementById('page'), 10.0, enums.EventType.OBJECT.SCROLL, enums.EventType.OBJECT.RESIZE);
    super.init();
  }

  /** @inheritdoc */
  destroy() {
    this.timeline.kill();
    super.destroy();
  }

  /** @inheritdoc */
  update() {
    if (this.isDirty(enums.DirtyType.POSITION|enums.DirtyType.SIZE)) {
      let rect = utils.getRect(this);

      if (rect.top < -100) {
        dom.setState(this.getChild('cover'), 'hidden');
      }
      else {
        dom.setState(this.getChild('cover'), 'none');
      }

      let contentNodes = this.getChild('contents').querySelectorAll('[data-field="image"]');
      let n = contentNodes.length;
      let d = 0;

      for (let i = 0; i < n; i++) {
        let node = contentNodes[i];

        if ((node.nodeType !== Node.ELEMENT_NODE) || (node.tagName.toLowerCase() === 'hr') || (node.isIn)) continue;

        if (utils.getIntersectRect(node).height > 0) {
          node.isIn = true;
          dom.setStyle(node, 'opacity', 1);
          dom.setStyle(node, 'transform', 'translate3d(0, 0, 0)');
          dom.setStyle(node, 'transition-delay', `${d*.1}s`);
          d++;
        }
      }
    }

    super.update();
  }

  in(done) {
    const cover = this.getChild('cover');
    const title = this.getChild('header.info.title');
    const date = this.getChild('header.info.date');
    const tags = this.getChild('header.info.tags');
    const contents = this.getChild('contents');

    this.timeline = new TimelineLite();
    if (contents) this.timeline.add(TweenLite.to(contents, 0, { opacity: 1 }));
    if (cover) this.timeline.add(TweenLite.to(cover, 1, { z: 0, opacity: 1, ease: 'Expo.easeOut' }));
    if (title) this.timeline.add(TweenLite.to(title, .3, { y: 0, opacity: 1, ease: 'Expo.easeOut' }), `-=.2`);
    if (date) this.timeline.add(TweenLite.to(date, .3, { y: 0, opacity: 1, ease: 'Expo.easeOut' }), `-=.2`);
    if (tags) this.timeline.add(TweenLite.to(tags, .3, { y: 0, opacity: 1, ease: 'Expo.easeOut' }), `-=.2`);
    this.timeline.add(() => { if (done) done(); });
  }

  out(done) {
    const cover = this.getChild('cover');
    const title = this.getChild('header.info.title');
    const date = this.getChild('header.info.date');
    const tags = this.getChild('header.info.tags');

    this.timeline = new TimelineLite();
    if (title) this.timeline.add(TweenLite.to(title, .3, { y: 40, opacity: 0, ease: 'Expo.easeIn' }));
    if (date) this.timeline.add(TweenLite.to(date, .3, { y: 40, opacity: 0, ease: 'Expo.easeIn' }), `-=.2`);
    if (tags) this.timeline.add(TweenLite.to(tags, .3, { y: 40, opacity: 0, ease: 'Expo.easeIn' }), `-=.2`);
    if (cover) this.timeline.add(TweenLite.to(cover, .3, { z: 300, opacity: 0, ease: 'Expo.easeIn' }));
    this.timeline.add(() => { if (done) done(); });
  }
}

export default Log;
