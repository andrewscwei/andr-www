/**
 * @file Default task - builds the entire app with the option to watch for
 *       changes and serve the app in the dev server.
 */

const appConfig = require(`./app.conf`);
const gulp = require(`gulp-prismic-mpa-builder`);
const path = require(`path`);

const baseDir = path.join(__dirname, `../`);

module.exports = {
  base: path.join(baseDir, appConfig.sourceDir),
  dest: path.join(baseDir, appConfig.buildDir),
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
        loader: `pug-loader?root=${path.join(baseDir, appConfig.viewsDir)}`
      }]
    },
    resolve: {
      extensions: [`.pug`],
      modules: [
        path.join(baseDir, appConfig.configDir, `data`),
        path.join(baseDir, appConfig.viewsDir, `includes`),
        path.join(baseDir, `node_modules`)
      ]
    }
  },
  views: process.env.SSR_ENABLED ? false : {
    i18n: {
      locales: appConfig.locales || [`en`],
      directory: path.join(baseDir, appConfig.configDir, `locales`)
    },
    metadata: {
      $config: appConfig,
      $data: require(`require-dir`)(path.join(baseDir, appConfig.configDir, `data`), { recurse: true })
    },
    collections: appConfig.collections,
    mathjax: true,
    prism: true,
    related: {
      terms: 3,
      max: 3,
      text: (doc) => (doc.markdown)
    },
    tags: appConfig.tags,
    watch: { files: [path.join(baseDir, appConfig.configDir, `**/*`)] }
  },
  sitemap: {
    siteUrl: appConfig.url
  }
};

gulp.init(module.exports);
