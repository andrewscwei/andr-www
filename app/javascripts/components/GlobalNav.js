import m from 'meno';
import 'gsap';

class GlobalNav extends m.Element(`global-nav`) {
  /** @inheritdoc */
  static get extends() { return `nav`; }

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
  destroy() {
    this.timeline.kill();
    super.destroy();
  }

  /** @inheritdoc */
  in(done) {
    const duration = .2;

    this.timeline = new TimelineLite();
    if (this.getChild(`home-button`)) this.timeline.add(TweenLite.to(this.getChild(`home-button`), duration, { y: 0, ease: `Expo.easeOut` }));
    if (this.getChild(`grid-button`)) this.timeline.add(TweenLite.to(this.getChild(`grid-button`), duration, { y: 0, ease: `Expo.easeOut` }));
    if (this.getChild(`logs-button`)) this.timeline.add(TweenLite.to(this.getChild(`logs-button`), duration, { y: 0, ease: `Expo.easeOut` }));
    this.timeline.add(() => { if (done) done(); });
  }

  /** @inheritdoc */
  out(done) {
    const duration = .2;

    this.timeline = new TimelineLite();
    if (this.getChild(`home-button`)) this.timeline.add(TweenLite.to(this.getChild(`home-button`), duration, { y: -100, ease: `Expo.easeOut` }));
    if (this.getChild(`grid-button`)) this.timeline.add(TweenLite.to(this.getChild(`grid-button`), duration, { y: -100, ease: `Expo.easeOut` }));
    if (this.getChild(`logs-button`)) this.timeline.add(TweenLite.to(this.getChild(`logs-button`), duration, { y: 100, ease: `Expo.easeOut` }));
    this.timeline.add(() => { if (done) done(); });
  }
}

m.register(GlobalNav);

export default GlobalNav;
