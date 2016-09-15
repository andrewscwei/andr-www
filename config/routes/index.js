// (c) Andrew Wei

'use strict';

const $ = require('../../config');
const _ = require('lodash');
const log = require('debug')('app');
const path = require('path');
const pluralize = require('pluralize');
const prismic = require('gulp-sys-metalprismic/helpers/prismic-helpers');
const router = require('express').Router();
const view = require('gulp-sys-metalprismic/helpers/view-helpers');

router.use('/', (req, res, next) => {
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
        if (c && c.permalink) docs[docType].forEach(doc => doc.path = view.getDocumentPath(doc, $.collections));
      }
      _.merge(req.app.locals.data, docs);
      next();
    })
    .catch(err => next());
});

router.get('/preview', (req, res, next) => {
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

router.get('/:collection', (req, res, next) => {
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

router.get('/:collection/:page', (req, res, next) => {
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

router.get('/:collection/:uid', (req, res, next) => {
  const collection = req.params['collection'];
  const docType = pluralize(collection, 1);
  const uid = req.params['uid'];
  const data = _.find(_.get(req.app.locals.data, `${docType}`), o => (o.uid === uid));

  if (data) {
    res.render(`layouts/${docType}`, data, (err, html) => {
      if (err) {
        res.render('404', { message: err });
      }
      else {
        res.send(html);
      }
    });
  }
  else {
    next();
  }
});

router.get('*', (req, res, next) => {
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

router.use((req, res, next) => {
  res.status(404).render('404');
});

module.exports = router;
