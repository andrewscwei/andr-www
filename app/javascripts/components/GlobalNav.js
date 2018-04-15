import m, { Element } from 'meno';
import anime from 'animejs';

class GlobalNav extends Element(`global-nav`) {
  /** @inheritdoc */
  static get extends() { return `nav`; }

  /**
   * Timeline instance.
   *
   * @type {Timeline}
   */
  get timeline() { return this.__private__.timeline; }
  set timeline(val) {
    if (this.__private__.timeline) this.__private__.timeline.pause();
    this.__private__.timeline = val;
  }

  /** @inheritdoc */
  destroy() {
    this.timeline.pause();
    super.destroy();
  }

  /** @inheritdoc */
  in(done) {
    const duration = 400;

    this.timeline = anime.timeline({ autoplay: false });
    if (this.getChild(`home-button`)) this.timeline.add({ targets: this.getChild(`home-button`), duration: duration, translateY: [-100, 0], easing: `easeOutExpo` });
    if (this.getChild(`grid-button`)) this.timeline.add({ targets: this.getChild(`grid-button`), duration: duration, translateY: [100, 0], easing: `easeOutExpo` });
    if (this.getChild(`logs-button`)) this.timeline.add({ targets: this.getChild(`logs-button`), duration: duration, translateY: [100, 0], easing: `easeOutExpo` });
    this.timeline.complete = () => { if (done) done(); };
    this.timeline.play();
  }

  /** @inheritdoc */
  out(done) {
    const duration = 600;

    this.timeline = anime.timeline({ autoplay: false });
    if (this.getChild(`home-button`)) this.timeline.add({ targets: this.getChild(`home-button`), duration, translateY: [0, -100], easing: `easeOutExpo` });
    if (this.getChild(`grid-button`)) this.timeline.add({ targets: this.getChild(`grid-button`), duration, translateY: [0, -100], easing: `easeOutExpo` });
    if (this.getChild(`logs-button`)) this.timeline.add({ targets: this.getChild(`logs-button`), duration, translateY: [0, 100], easing: `easeOutExpo` });
    this.timeline.complete = () => { if (done) done(); };
    this.timeline.play();
  }
}

export default m.register(GlobalNav);
