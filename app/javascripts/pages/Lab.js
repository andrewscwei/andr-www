// (c) Andrew Wei

import { ui } from 'requiem';
import 'gsap';

class Lab extends ui.Element() {
  static get tag() { return 'page-lab'; }
  static get extends() { return 'div'; }

  in(done) {
    if (done) done();
  }

  out(done) {
    if (done) done();
  }
}

export default Lab;
