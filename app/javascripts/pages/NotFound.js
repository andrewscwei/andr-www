import { register } from 'meno';
import Page from './Page';

class NotFound extends Page {
  /** @inheritdoc */
  static get tag() { return 'page-404'; }
}

export default register(NotFound);
