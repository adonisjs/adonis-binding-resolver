'use strict'

/*
 * adonis-binding-resolver
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const Resolver = require('./src/Resolver')
let directories = {}
let appNamespace = null
let foldInstance = null

const getInstance = function (forDir = null) {
  return new Resolver(directories, appNamespace, foldInstance, forDir)
}

module.exports = {
  /**
   * Register directories to be used for making
   * namespaces
   *
   * @method directories
   *
   * @param  {Object}    dirs
   *
   * @return {void}
   */
  directories (dirs) {
    directories = dirs
  },

  /**
   * Set app namespace to be used for making
   * complete namespaces from relative
   * namespaces.
   *
   * @method appNamespace
   *
   * @param  {String}     namespace
   *
   * @return {void}
   */
  appNamespace (namespace) {
    appNamespace = namespace
  },

  /**
   * Use fold instance for resolving bindings
   *
   * @method use
   *
   * @param  {Object} fold
   *
   * @return {void}
   */
  use (fold) {
    foldInstance = fold
  },

  /**
   * Returns the resolver instance specified
   * to translate namespace for a given
   * directory only.
   *
   * @method forDir
   *
   * @param  {String} forDir
   *
   * @return {Object}
   */
  forDir (forDir) {
    return getInstance(forDir)
  },

  /**
   * Translate binding using resolver translate
   * method.
   */
  translate (...params) {
    return getInstance().translate(...params)
  },

  /**
   * Resolve binding using resolver resolve
   * method.
   */
  resolve (...params) {
    return getInstance().resolve(...params)
  },

  /**
   * Resolve binding using resolver resolveFunc
   * method.
   */
  resolveFunc (...params) {
    return getInstance().resolveFunc(...params)
  }
}
