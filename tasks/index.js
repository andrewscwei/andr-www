// (c) Andrew Wei
/**
 * @file Default task - builds the entire app with the option to watch for
 *       changes and serve the app in the dev server.
 */

const gulp = require('gulp-sys-metalprismic');
const task = require('../helpers/task-helpers');
const view = require('../helpers/view-helpers');

gulp.init({
  base: task.src(),
  dest: task.dest(),
  scripts: {
    entry: {
      application: 'application.js'
    },
    resolve: {
      root: [
        task.config('data')
      ]
    }
  },
  views: {
    i18n: view.i18n(),
    metadata: view.metadata(),
    collections: view.documents(),
    watch: {
      files: [task.config('**/*')]
    }
  }
});
