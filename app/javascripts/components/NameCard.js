// (c) Andrew Wei

import { ui } from 'requiem';
import 'gsap';

class NameCard extends ui.Element() {
  static get tag() { return 'name-card'; }
  static get extends() { return 'div'; }

  in(done) {
    this.state = 'active';
    if (done) done();
  }

  out(done) {
    this.state = 'none';
    if (done) done();
  }
}

export default NameCard;
