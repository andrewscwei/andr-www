// (c) Andrew Wei

import { ui } from 'requiem';
import 'gsap';

class Profile extends ui.Element() {
  static get tag() { return 'page-profile'; }
  static get extends() { return 'div'; }

  in(done) {
    this.getChild('name-card').in(done);
  }

  out(done) {
    this.getChild('name-card').out(done);
  }

  show() {
    this.state = 'none';
  }

  hide() {
    this.state = 'hidden';
  }
}

export default Profile;
