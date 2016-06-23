// (c) Andrew Wei

'use strict';

import 'webcomponents.js/webcomponents-lite';
import $ from '../../config';
import _ from 'lodash';
import pm from 'page-manager';
import requiem, { dom } from 'requiem';
import WebFont from 'webfontloader';

// Register all components.
const req = require.context('./', true, /^((?!PageManager)(?!application).)*.js$/);
req.keys().forEach((path) => requiem(req(path).default));

pm.locales = $.locales;
pm.autoRouting = $.autoRouting;

pm.transition('in', '/', (next) => {
  dom.getChild('profile').in();
  dom.getChild('profile').show();
  next();
});

pm.transition('in', '/logs/', (next) => {
  dom.getChild('profile').in();
  dom.getChild('profile').hide();
})

pm.transition('out', (next) => {
  next();
});

// pm.transition('out', '/', '/about', (next) => {
//   // Transition-out behavior specifically for '/' going into '/about'.
//   next();
// });

// pm.on('beforeLoad', (next) => {
//   // Do something before image preloading for all pages.
//   next();
// });

// pm.on('loading', '/gallery', (loaded, total) => {
//   // Do something while images are preloading only in the '/gallery' page.
//   console.log(`Loading: ${Math.round(loaded*100)}/${total*100}`);
// });

// pm.on('afterLoad', '/gallery', (next) => {
//   // Do something when images are done preloading in the '/gallery' page.
//   next();
// });

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
