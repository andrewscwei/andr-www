// (c) Andrew Wei

'use strict';

import 'webcomponents.js/webcomponents-lite';
import $ from '../../config';
import _ from 'lodash';
import pm from 'page-manager';
import requiem, { dom, enums } from 'requiem';
import WebFont from 'webfontloader';

// Register all components.
const req = require.context('./', true, /^((?!PageManager)(?!application).)*.js$/);
req.keys().forEach((path) => requiem(req(path).default));

pm.locales = $.locales;
pm.autoRouting = $.autoRouting;

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

// Begin routing after all requirements are defined. Comment out this line if
// you do not want routing enabled.
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

function transitionIn(element, next) {
  if (!element) { if (next) next(); return; }

  if (element.in && (element.nodeState === enums.NodeState.UPDATED))
    element.in(next);
  else
    element.addEventListener(enums.EventType.NODE.UPDATE, event => { if (element.in) element.in(next); else if (next) next(); });
}

function transitionOut(element, next) {
  if (!element) { if (next) next(); return; }

  if (element.out && (element.nodeState === enums.NodeState.UPDATED))
    element.out(next);
  else
    element.addEventListener(enums.EventType.NODE.UPDATE, event => { if (element.out) element.out(next); else if (next) next(); });
}
