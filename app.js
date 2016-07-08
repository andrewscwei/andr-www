// (c) Andrew Wei

'use strict';

const $ = require('./config');
const _ = require('lodash');
const bodyParser = require('body-parser');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs-extra');
const http = require('http');
const i18n = require('i18n');
const log = require('debug')('app');
const logger = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const task = require('./helpers/task-helpers');
const view = require('./helpers/view-helpers');

// Create app and define global/local members.
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', task.views());
app.set('view engine', 'pug');
app.locals.basedir = task.views();

// Localization setup.
// @see {@link https://www.npmjs.com/package/i18n}
i18n.configure(view.i18n());
app.use(i18n.init);

// Favicon serving setup.
// @see {@link https://www.npmjs.com/package/serve-favicon}
app.use(favicon(task.dest('favicon.png')));

// Enable gzip compression.
// @see {@link https://www.npmjs.com/package/compression}
app.use(compress());

// HTTP request logger setup.
// @see {@link https://www.npmjs.com/package/morgan}
app.use(logger('combined', { stream: fs.createWriteStream(__dirname + '/logs/access.log', { flags: 'a' }) }));

// Form body parsing setup.
// @see {@link https://www.npmjs.com/package/body-parser}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie header parsing setup. Populates req.cookies.
// @see {@link https://www.npmjs.com/package/cookie-parser}
app.use(cookieParser());

// Method override setup.
// @see {@link https://www.npmjs.com/package/method-override}
app.use(methodOverride());

// Set up Prismic previews if enabled.
if (process.env.PRISMIC_PREVIEWS_ENABLED) app.use('/', require(task.config('routes')));

// Serve static files and add expire headers.
app.use(express.static(task.dest(), {
  setHeaders: function(res, path) {
    if (!/^\/assets\//.test(res.req.url)) return;

    const duration = 1000 * 60 * 60 * 24 * 365 * 10;
    res.setHeader('Expires', (new Date(Date.now() + duration)).toUTCString());
    res.setHeader('Cache-Control', `max-age=${duration / 1000}`);
  }
}));

// Handle 404 error.
app.use(function(req, res, next) {
  res.status(404).render('404');
});

// Start listening at designated port.
http
  .createServer(app)
  .listen(app.get('port'))
  .on('error', function(error) {
    if (error.syscall !== 'listen') throw error;

    // Handle specific errors with friendly messages.
    switch (error.code) {
      case 'EACCES':
        log(`Port ${this.address().port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        log(`Port ${this.address().port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  })
  .on('listening', function() {
    log(`Listening at http://${this.address().address}:${this.address().port}`);
  });

module.exports = app;
