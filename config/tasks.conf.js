/**
 * @file Default task - builds the entire app with the option to watch for
 *       changes and serve the app in the dev server.
 */

const $ = require(`./app.conf`);
const gulp = require(`gulp-prismic-mpa-builder`);
const path = require(`path`);

const baseDir = path.join(__dirname, `../`);

module.exports = {
  base: path.join(baseDir, $.sourceDir),
  dest: path.join(baseDir, $.buildDir),
  extras: {
    base: path.join(baseDir, `app`, `static`)
  },
  scripts: {
    entry: {
      application: `application.js`
    },
    module: {
      rules: [{
        test: /\.pug/,
        loader: `pug-loader?root=${path.join(baseDir, $.viewsDir)}`
      }]
    },
    resolve: {
      extensions: [`.pug`],
      modules: [
        path.join(baseDir, $.configDir, `data`),
        path.join(baseDir, $.viewsDir, `includes`),
        path.join(baseDir, `node_modules`)
      ]
    },
    envs: {
      development: {
        plugins: [
          new (require(`webpack`).DefinePlugin)({
            'process.env': {
              NODE_ENV: JSON.stringify(`development`)
            }
          })
        ]
      },
      production: {
        plugins: [
          new (require(`webpack`).DefinePlugin)({
            'process.env': {
              NODE_ENV: JSON.stringify(`production`)
            }
          })
        ]
      }
    }
  },
  views: process.env.SSR_ENABLED ? false : {
    i18n: {
      locales: $.locales || [`en`],
      directory: path.join(baseDir, $.configDir, `locales`)
    },
    metadata: {
      $: $,
      env: process.env,
      _: require(`lodash`),
      m: require(`moment`)
    },
    collections: $.collections,
    mathjax: true,
    prism: true,
    related: {
      terms: 3,
      max: 3,
      text: (doc) => (doc.markdown)
    },
    tags: $.tags,
    watch: { files: [path.join(baseDir, $.configDir, `**/*`)] }
  },
  serve: {
    port: 8080
  },
  sitemap: {
    siteUrl: $.url
  }
};

gulp.init(module.exports);
