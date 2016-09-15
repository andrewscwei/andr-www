// (c) Andrew Wei

'use strict';

const $ = require('../config');
const _ = require('lodash');
const async = require('async');
const browserSync = require('browser-sync');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const request = require('supertest');

const baseDir = path.join(__dirname, '../');

describe('app', function() {
  let app;

  before(function(done) {
    this.timeout(10000);
    browserSync.reset();

    app = browserSync.init({
      server: { baseDir: path.join(baseDir, $.buildDir) },
      open: false,
      logLevel: 'silent'
    }, done).instance;
  });

  after(function() {
    app.cleanup();
  })

  it('should not have broken links', function(done) {
    let paths = [];
    let error;

    fs
      .walk(path.join(baseDir, $.buildDir))
      .on('data', function(item) {
        if (item.stats.isDirectory() || !_.endsWith(item.path, '.html')) return;
        let res = fs.readFileSync(item.path, 'utf-8').match(/=["|']((\/)([a-zA-Z0-9\-\_\/\.]+))["|']/g);
        res.forEach((v, i) => {
          let p = v.replace(/("|')/g, '');
          if (_.startsWith(p, '=')) p = p.substr(1);
          if (_.isEmpty(path.extname(p)) && !_.endsWith(p, '/')) p = `${p}/`;
          if (!_.startsWith(p, '//') && !_.startsWith(p, 'http')) paths.push(p);
        });
      })
      .on('end', function() {
        async.eachSeries(_.uniq(paths), function(path, callback) {
          request(app.server)
            .get(path)
            .expect(200)
            .end(function(err, res) {
              if (err) {
                error = err;
                console.log(chalk.red('Request failed for:'), path);
              }

              callback();
            });
        }, function() {
          if (error)
            throw error;
          else
            done();
        });
      });

  });
});
