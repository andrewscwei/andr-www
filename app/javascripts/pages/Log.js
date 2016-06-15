// (c) Andrew Wei

import { ui } from 'requiem';
import 'gsap';

class Log extends ui.Element() {
  static get tag() { return 'page-log'; }
  static get extends() { return 'div'; }

  in(done) {
    if (done) done();
  }

  out(done) {
    if (done) done();
  }
}

export default Log;
