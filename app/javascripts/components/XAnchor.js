// © Andrew Wei

import { enums, ui } from 'requiem';

class XAnchor extends ui.Element(HTMLAnchorElement) {
  /** @inheritdoc */
  static get tag() { return 'x-a'; }

  /** @inheritdoc */
  static get extends() { return 'a'; }

  /**
   * Specifies whether this anchor element auto disables itself upon clicking.
   *
   * @type {boolean}
   */
  get autoDisable() { return (typeof this.__private__.autoDisable === 'boolean') ? this.__private__.autoDisable : true; }
  set autoDisable(val) { this.__private__.autoDisable = val; }

  /** @inheritdoc */
  init() {
    this.on(enums.EventType.MOUSE.CLICK, () => this.disabled = true);
    super.init();
  }
}

export default XAnchor;
