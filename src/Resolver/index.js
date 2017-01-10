'use strict'

/**
 * adonis-binding-resolver
 * @license MIT
 * @copyright AdonisJs - Harminder Virk <virk@adonisjs.com>
 */

const NE = require('node-exceptions')

/**
 * Validate, resolve and execute bindings attached as a closure or IoC Container binding.
 *
 * @class Resolver
 * @module Adonis
 * @submodule binding-resolver
 */
class Resolver {

  /**
   * Constructor.
   *
   * @constructor
   * @param  {object} Ioc
   * @return {void}
   */
  constructor (Ioc) {
    this.Ioc = Ioc
  }

  /**
   * Validates a binding to be sure that it must points to a valid
   * namespace or closure and IoC Container binding points to a method.
   *
   * @method validateBinding
   * @param  {function|string} binding
   * @throws {InvalidArgumentException} E_INVALID_IOC_BINDING
   * @return {void}
   */
  validateBinding (binding) {
    if (typeof (binding) !== 'function' && typeof (binding) !== 'string') {
      throw new NE.InvalidArgumentException('Handler must point to a valid namespace or a closure', 500, 'E_INVALID_IOC_BINDING')
    }
    if (typeof (binding) === 'string' && binding.split('.').length !== 2) {
      throw new NE.InvalidArgumentException('Make sure IoC container binding points to a method', 500, 'E_INVALID_IOC_BINDING')
    }
  }

  /**
   * Resolves a binding depending of its type.
   *
   * @method resolveBinding
   * @param  {function|string} binding
   * @return {mixed}
   */
  resolveBinding (binding) {
    if (typeof (binding) === 'function') {
      return binding
    }
    if (typeof (binding) === 'string') {
      return this.Ioc.makeFunc(binding)
    }
  }

  /**
   * Executes a binding depending of its type.
   *
   * @method executeBinding
   * @param  {function|string} binding
   * @param  {array} args
   * @param  {object} customInstance
   * @return {mixed}
   */
  executeBinding (binding, args, customInstance) {
    args = args || []
    const resolvedBinding = this.resolveBinding(binding)
    if (typeof (resolvedBinding) === 'function') {
      return resolvedBinding.apply(customInstance || null, args)
    }
    if (resolvedBinding.instance && resolvedBinding.method) {
      return resolvedBinding.instance[resolvedBinding.method].apply(customInstance || resolvedBinding.instance, args)
    }
  }

}

module.exports = Resolver
