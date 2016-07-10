// (c) Andrew Wei

'use strict';

import 'webcomponents.js/webcomponents-lite';
import $ from '../../config';
import _ from 'lodash';
import pm from 'page-manager';
import requiem, { dom, enums } from 'requiem';
import WebFont from 'webfontloader';

// Register all components.
const req = require.context('./', true, /^((?!Playground)(?!application).)*.js$/);
req.keys().forEach((path) => requiem(req(path).default));

pm.locales = $.locales;
pm.autoRouting = $.autoRouting;

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
  dom.sightread();
  transitionIn(dom.getChild('global-nav'));
  transitionIn(dom.getChild('home'), next);
});

pm.transition('out', '/', (next) => {
  transitionOut(dom.getChild('global-nav'));
  transitionOut(dom.getChild('home'), next);
});

pm.transition('in', '*', (next) => {
  dom.sightread();
  transitionOut(dom.getChild('home'));
  transitionIn(dom.getChild('global-nav'));
  transitionIn(dom.getChild('page'), next);
});

pm.transition('out', '*', (next) => {
  transitionOut(dom.getChild('global-nav'));
  transitionOut(dom.getChild('page'), next);
});

// Begin routing after all requirements are defined.
if ($.webFont) {
  WebFont.load(_.merge($.webFont, {
    classes: false,
    active: pm.startRouting,
    inactive: pm.startRouting
  }));
}
else {
  pm.startRouting();
}

/**
 * Custom async transition-in behavior.
 *
 * @param {Element} element - Target element to transition.
 * @param {Function} next - Callback.
 */
function transitionIn(element, next) {
  if (!element) { if (next) next(); return; }

  if (element.in && (element.nodeState === enums.NodeState.UPDATED))
    element.in(next);
  else
    element.addEventListener(enums.EventType.NODE.UPDATE, event => { if (element.in) element.in(next); else if (next) next(); });
}

/**
 * Custom async transition-out behavior.
 *
 * @param {Element} element - Target element to transition.
 * @param {Function} next - Callback.
 */
function transitionOut(element, next) {
  if (!element) { if (next) next(); return; }

  if (element.out && (element.nodeState === enums.NodeState.UPDATED))
    element.out(next);
  else
    element.addEventListener(enums.EventType.NODE.UPDATE, event => { if (element.out) element.out(next); else if (next) next(); });
}
