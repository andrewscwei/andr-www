// (c) Andrew Wei

import _ from 'lodash';
import { dom, enums, utils } from 'requiem';
import Page from './Page';
import Prism from 'prismjs';
import 'gsap';

class Log extends Page {
  /** @inheritdoc */
  static get tag() { return 'page-log'; }

  /** @inheritdoc */
  init() {
    this.respondsTo(this, 10.0, enums.EventType.OBJECT.SCROLL, enums.EventType.OBJECT.RESIZE);

    // Process code blocks.
    this.syntaxHighlight(document.querySelectorAll('[data-slicetype="language-bash"] pre'), 'bash');

    super.init();
  }

  /** @inheritdoc */
  update() {
    if (this.isDirty(enums.DirtyType.POSITION|enums.DirtyType.SIZE)) {
      let rect = utils.getRect(document.getElementById('inner-page') || this);
      let cover = dom.getChild('cover');

      if (rect.top < -100) {
        if (cover) dom.setState(dom.getChild('cover'), 'hidden');
      }
      else {
        if (cover) dom.setState(dom.getChild('cover'), 'none');
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

  /** @inheritdoc */
  in(done) {
    const cover = dom.getChild('cover');
    const title = this.getChild('header.info.title');
    const date = this.getChild('header.info.date');
    const tags = this.getChild('header.info.tags');
    const contents = this.getChild('contents');

    this.timeline = new TimelineLite();
    if (contents) this.timeline.add(TweenLite.to(contents, 0, { y: 0, opacity: 1 }));
    if (cover) this.timeline.add(TweenLite.to(cover, 1, { z: 0, opacity: 1, ease: 'Expo.easeOut' }));
    if (title) this.timeline.add(TweenLite.to(title, .3, { y: 0, opacity: 1, ease: 'Expo.easeOut' }), `-=.2`);
    if (date) this.timeline.add(TweenLite.to(date, .3, { y: 0, opacity: 1, ease: 'Expo.easeOut' }), `-=.2`);
    if (tags) this.timeline.add(TweenLite.to(tags, .3, { y: 0, opacity: 1, ease: 'Expo.easeOut' }), `-=.2`);
    this.timeline.add(() => { if (done) done(); });
  }

  /** @inheritdoc */
  out(done) {
    const cover = dom.getChild('cover');
    const title = this.getChild('header.info.title');
    const date = this.getChild('header.info.date');
    const tags = this.getChild('header.info.tags');
    const contents = this.getChild('contents');

    this.timeline = new TimelineLite();
    if (contents) this.timeline.add(TweenLite.to(contents, .3, { y: 100, opacity: 0, ease: 'Expo.easeIn' }));
    if (title) this.timeline.add(TweenLite.to(title, .3, { y: 40, opacity: 0, ease: 'Expo.easeIn' }), `-=.3`);
    if (date) this.timeline.add(TweenLite.to(date, .3, { y: 40, opacity: 0, ease: 'Expo.easeIn' }), `-=.2`);
    if (tags) this.timeline.add(TweenLite.to(tags, .3, { y: 40, opacity: 0, ease: 'Expo.easeIn' }), `-=.2`);
    if (cover) this.timeline.add(TweenLite.to(cover, .3, { z: 300, opacity: 0, ease: 'Expo.easeIn' }));
    this.timeline.add(() => { if (done) done(); });
  }

  syntaxHighlight(elements, language) {
    if (!elements || !elements.length || !language) return;

    let n = elements.length;

    for (let i = 0; i < n; i++) {
      const element = elements[i];
      dom.addClass(element, _.startsWith(language, 'language-') ? language : `language-${language}`);
      Prism.highlightElement(element);
    }
  }
}

export default Log;
