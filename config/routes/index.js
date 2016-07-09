// (c) Andrew Wei

'use strict';

const $ = require('../../config');
const _ = require('lodash');
const log = require('debug')('app');
const moment = require('moment');
const path = require('path');
const prismic = require('../../helpers/prismic-helpers');
const router = require('express').Router();
const view = require('../../helpers/view-helpers');

router.use('/', (req, res, next) => {
  if (path.extname(req.path) !== '') {
    next();
    return;
  }

  _.merge(res.locals, view.metadata());

  prismic
    .getAPI(process.env.PRISMIC_API_ENDPOINT, { accessToken: process.env.PRISMIC_ACCESS_TOKEN })
    .then(api => {
      const ref = req.cookies[prismic.previewCookie] || api.master();
      const orderings = _.flatMap($.documents, (val, key) => (`my.${key}.${val.sortBy}${val.reverse ? ' desc' : ''}`));

      res.locals.ctx = {
        api: api,
        ref: ref
      };

      return prismic.getEverything(api, ref, '', orderings);
    })
    .then(response => {
      let docs = prismic.reduce(response.results);

      for (let docType in docs) {
        const c = _.get($, `documents.${docType}`);

        if (c && c.collection) {
          docs[docType].forEach(doc => {
            doc.path = view.documentPath(doc, $.documents);
          });
        }
      }

      _.merge(res.locals.data, docs);

      next();
    })
    .catch(err => {
      res.status(500).render('500', { message: err.message });
    });
});

router.get('/preview', (req, res, next) => {
  const previewToken = req.query['token'];
  const ctx = res.locals.ctx;

  if (!previewToken) {
    res.status(500).render('500', { message: 'No preview token provided' });
  }
  else {
    ctx.api
      .previewSession(previewToken, (doc) => (view.documentPath(doc, $.documents) || '/'), '/')
      .then(url => {
        res.cookie(prismic.previewCookie, previewToken, { maxAge: 60 * 30, path: '/', httpOnly: false });
        res.redirect(url);
      })
      .catch(err => {
        res.status(500).render('500', { message: err.message });
      });
  }
});

router.get('/logs', (req, res, next) => {
  next();
});

router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
