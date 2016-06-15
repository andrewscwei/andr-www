// (c) Andrew Wei

const $ = require('../config');
const path = require('path');

/**
 * Gets the base project path.
 *
 * @return {string}
 */
exports.base = function() { return path.join(__dirname, '../'); };

/**
 * Gets the project module directory path.
 *
 * @return {string}
 */
exports.modules = function() { return path.join(exports.base(), 'node_modules'); };

/**
 * Gets the path relative to the config directory using the specified pattern.
 *
 * @param {string} [patternRelativeToConfigDir]
 *
 * @return {string}
 */
exports.config = function(patternRelativeToConfigDir) { return path.join(exports.base(), $.configDir || 'config', patternRelativeToConfigDir || ''); };

/**
 * Gets the path relative to the source directory using the specified pattern.
 *
 * @param {string} [patternRelativeToSourceDir]
 *
 * @return {string}
 */
exports.src = function(patternRelativeToSourceDir) { return path.join(exports.base(), $.sourceDir || 'app', patternRelativeToSourceDir || ''); };

/**
 * Gets the path relative to the build directory using the specified pattern.
 *
 * @param {string} [patternRelativeToBuildDir]
 *
 * @return {string}
 */
exports.dest = function(patternRelativeToBuildDir) { return path.join(exports.base(), $.buildDir || 'public', patternRelativeToBuildDir || ''); };

/**
 * Gets the path relative to the views directory using the specified pattern.
 *
 * @param {string} [patternRelativeToViewsDir]
 *
 * @return {string}
 */
exports.views = function(patternRelativeToViewsDir) { return path.join(exports.base(), $.viewsDir || 'app/views', patternRelativeToViewsDir || ''); };
