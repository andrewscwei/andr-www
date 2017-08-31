// © Andrew Wei

'use strict';

const $ = require('../config');
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
const mathjaxDOM = require('mathjax-dom');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');
const pluralize = require('pluralize');
const prismDOM = require('prism-dom');
const prismic = require('gulp-sys-metalprismic/helpers/prismic-helpers');
const view = require('gulp-sys-metalprismic/helpers/view-helpers');

const baseDir = path.join(__dirname, '../');

// Create app and define global/local members.
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(baseDir, $.viewsDir));
app.set('view engine', 'pug');
app.locals.basedir = path.join(baseDir, $.viewsDir);
_.merge(app.locals, {
  _: _,
  $: $,
  data: require('require-dir')(path.join(baseDir, $.configDir, 'data'), { recurse: true }),
  env: process.env,
  m: require('moment'),
  p: p => (view.getPath(p, path.join(baseDir, $.buildDir, 'rev-manifest.json')))
});

// Localization setup.
// @see {@link https://www.npmjs.com/package/i18n}
i18n.configure({
  default: (($.locales instanceof Array) ? $.locales[0] : $.locales) || 'en',
  locales: $.locales || ['en'],
  directory: path.join(baseDir, $.configDir, 'locales')
});
app.use(i18n.init);

// Favicon serving setup.
// @see {@link https://www.npmjs.com/package/serve-favicon}
app.use(favicon(path.join(baseDir, $.buildDir, 'favicon.png')));

// Enable gzip compression.
// @see {@link https://www.npmjs.com/package/compression}
app.use(compress());

// HTTP request logger setup.
// @see {@link https://www.npmjs.com/package/morgan}
try { fs.mkdirSync(__dirname + '/logs'); } catch (err) {}
app.use(morgan('combined', { stream: fs.createWriteStream(__dirname + '/logs/access.log', { flags: 'a' }) }));

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

// Serve static files and add expire headers.
app.use(express.static(path.join(baseDir, $.buildDir), {
  setHeaders: function(res, path) {
    if (!/^\/assets\//.test(res.req.url)) return;

    const duration = 1000 * 60 * 60 * 24 * 365 * 10;
    res.setHeader('Expires', (new Date(Date.now() + duration)).toUTCString());
    res.setHeader('Cache-Control', `max-age=${duration / 1000}`);
  }
}));

app.use('/', (req, res, next) => {
  prismic
    .getAPI(process.env.PRISMIC_API_ENDPOINT, { accessToken: process.env.PRISMIC_ACCESS_TOKEN })
    .then(api => {
      const ref = req.cookies[prismic.previewCookie] || api.master();
      const orderings = _.flatMap($.collections, (val, key) => (`my.${key}.${val.sortBy}${val.reverse ? ' desc' : ''}`));
      res.locals.ctx = { api: api, ref: ref };
      return prismic.getEverything(api, ref, '', orderings);
    })
    .then(response => {
      const docs = prismic.reduce(response.results, true, $);
      for (let docType in docs) {
        const c = _.get($, `collections.${docType}`);
        if (c && c.permalink) docs[docType].forEach(doc => {
          doc.path = view.getDocumentPath(doc, $.collections);
        });
      }
      _.merge(req.app.locals.data, docs);
      next();
    })
    .catch(err => next());
});

app.get('/preview', (req, res, next) => {
  const previewToken = req.query['token'];
  const ctx = res.locals.ctx;

  if (!previewToken) {
    res.status(500).render('500', { message: 'No preview token provided' });
  }
  else {
    ctx.api
      .previewSession(previewToken, (doc) => (view.getDocumentPath(doc, $.collections) || '/'), '/')
      .then(url => {
        res.cookie(prismic.previewCookie, previewToken, { maxAge: 60 * 30, path: '/', httpOnly: false });
        res.redirect(url);
      })
      .catch(err => {
        res.status(500).render('500', { message: err.message });
      });
  }
});

app.get('/:collection', (req, res, next) => {
  const collection = req.params['collection'];
  const docType = pluralize(collection, 1);
  const config = $.collections[docType];

  if (config) {
    res.locals.pagination = view.getPaginationData(collection, req.app.locals.data[docType], 1, $.collections);
    res.render(`layouts/${collection}`);
  }
  else {
    next();
  }
});

app.get('/:collection/:page', (req, res, next) => {
  const page = Number(req.params['page']);

  if (isNaN(page)) {
    next();
  }
  else {
    const collection = req.params['collection'];
    const docType = pluralize(collection, 1);
    const pagination = view.getPaginationData(collection, req.app.locals.data[docType], page, $.collections);

    if (!pagination) {
      next();
    }
    else {
      res.locals.pagination = pagination;
      res.render(`layouts/${collection}`);
    }
  }
});

app.get('/:collection/:uid', async function(req, res, next) {
  const collection = req.params['collection'];
  const docType = pluralize(collection, 1);
  const uid = req.params['uid'];
  const data = _.find(_.get(req.app.locals.data, `${docType}`), o => (o.uid === uid));

  if (data) {
    res.render(`layouts/${docType}`, data, async function(err, html) {
      if (err) {
        res.render('404', { message: err });
      }
      else {
        if (data.mathjax === true) html = await mathjaxDOM(html);
        if (data.prism === true) html = await prismDOM(html);
        res.send(html);
      }
    });
  }
  else {
    next();
  }
});

app.get('*', (req, res, next) => {
  let path = `${req.path.split('/').join('/')}`;
  while (_.startsWith(path, '/')) path = path.substr(1);
  if (_.endsWith(path, '/')) path = path.substr(0, path.length-1);
  if (path === '') path = 'index';

  res.render(path, {}, (err, html) => {
    if (err) {
      res.render('404', { message: err });
    }
    else {
      res.send(html);
    }
  });
});

app.use((req, res, next) => {
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
