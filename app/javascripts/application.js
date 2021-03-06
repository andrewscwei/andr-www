import isTouchDevice from 'is-touch-device';
import { dom, NodeState } from 'meno';
import pm from 'page-manager';
import appConfig from '../../config/app.conf';
import './components/GlobalNav';
import './components/Link';
import './pages/Home';
import './pages/Log';
import './pages/Logs';

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*,meno*';
}

// Detect touch device.
if (isTouchDevice()) {
  document.documentElement.classList.add('touch');
}

pm.locales = appConfig.locales;
pm.autoRouting = appConfig.autoRouting;

// Put page routing/transitioning/loading logic here.
pm.request((newDocument, oldDocument, next) => {
  let oldMJStyles = oldDocument.getElementById('MathJax_SVG_styles');
  let oldMJDefs = oldDocument.getElementById('MathJax_SVG_glyphs');
  let newMJStyles = newDocument.getElementById('MathJax_SVG_styles');
  let newMJDefs = newDocument.getElementById('MathJax_SVG_glyphs');

  if (oldMJStyles) oldMJStyles.parentNode.removeChild(oldMJStyles);
  if (oldMJDefs) oldMJDefs.parentNode.parentNode.removeChild(oldMJDefs.parentNode);

  if (newMJDefs) oldDocument.body.insertBefore(newMJDefs.parentNode, oldDocument.body.firstChild);
  if (newMJStyles) oldDocument.body.insertBefore(newMJStyles, oldDocument.body.firstChild);

  next();
});

pm.transition('in', '/', (next) => {
  transitionIn(dom.getChild('global-nav'));
  transitionIn(dom.getChild('home'), next);
});

pm.transition('out', '/', (next) => {
  transitionOut(dom.getChild('global-nav'));
  transitionOut(dom.getChild('home'), next);
});

pm.transition('in', '*', (next) => {
  transitionOut(dom.getChild('home'));
  transitionIn(dom.getChild('global-nav'));
  transitionIn(dom.getChild('page'), next);
});

pm.transition('out', '*', (next) => {
  transitionOut(dom.getChild('global-nav'));
  transitionOut(dom.getChild('page'), next);
});

// Begin routing after all requirements are defined.
pm.startRouting();

/**
 * Custom async transition-in behavior.
 *
 * @param {Element} element - Target element to transition.
 * @param {Function} next - Callback.
 */
function transitionIn(element, next) {
  if (!element) { if (next) next(); return; }

  if (element.in && (element.nodeState === NodeState.INITIALIZED)) element.in(next);
  else element.addEventListener('nodeinitialize', event => {
    if (element.in) element.in(next); else if (next) next();
  });
}

/**
 * Custom async transition-out behavior.
 *
 * @param {Element} element - Target element to transition.
 * @param {Function} next - Callback.
 */
function transitionOut(element, next) {
  if (!element) { if (next) next(); return; }

  if (element.out && (element.nodeState === NodeState.INITIALIZED)) element.out(next);
  else element.addEventListener('nodeinitialize', event => { if (element.out) element.out(next); else if (next) next(); });
}
