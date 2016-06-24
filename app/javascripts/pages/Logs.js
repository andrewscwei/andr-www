// (c) Andrew Wei

import { dom, enums, events, ui, utils } from 'requiem';
import Hammer from 'hammerjs';
import 'gsap';

const DirtyType = enums.DirtyType;
const EventType = enums.EventType;
const EventTimer = events.EventTimer;

class Logs extends ui.Element() {
  static get tag() { return 'page-logs'; }
  static get extends() { return 'div'; }

  init() {
    super.init();
  }

  destroy() {
    super.destroy();
  }

  update() {
    super.update();
  }

  in(done) {
    if (done) done();
  }

  out(done) {
    if (done) done();
  }
}

export default Logs;
