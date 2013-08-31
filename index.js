var create = require('./middlewares/create'),
    approve = require('./middlewares/approve'),
    execute = require('./middlewares/execute'),
    initialize = require('./middlewares/initialize');


function Kaching () {
  this._key = 'kaching';
  this._strategies = {};
}

Kaching.prototype.strategy = function(name) {
  var strategy = this._strategies[name];
  if (!strategy) {
    throw new Error('no strategy registered under name: ' + name);
  }
  return strategy;
};

/**
 * Utilize the given `strategy` with optional `name`, overridding the strategy's
 * default name.
 *
 * @param {String|Strategy} name
 * @param {Strategy} strategy
 * @return {Kaching} for chaining
 * @api public
 */
Kaching.prototype.use = function(name, strategy) {
  if (!strategy) {
    strategy = name;
    name = strategy.name;
  }
  if (!name) throw new Error('authentication strategies must have a name');

  this._strategies[name] = strategy;
  return this;
};

/**
 * Un-utilize the `strategy` with given `name`.
 *
 * @param {String} name
 * @return {Kaching} for chaining
 * @api public
 */
Kaching.prototype.unuse = function(name) {
  delete this._strategies[name];
  return this;
};

/**
 * Kaching's primary initialization middleware.
 *
 * This middleware must be in use by the Connect/Express application for
 * Kaching to operate.
 *
 * @param {Object} options
 * @return {Function} middleware
 * @api public
 */
Kaching.prototype.initialize = function() {
  return initialize().bind(this);
};

/**
 * Middleware that will create a payment using the given `strategy` name,
 * with optional `options` and `callback`.
 *
 * @param {String} strategy
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} middleware
 * @api public
 */
Kaching.prototype.create = function(strategy, options, callback) {
  return create(strategy, options, callback).bind(this);
};

/**
 * Middleware that will redirect to the approval url of the payment using
 * the given `strategy` name, with optional `options` and `callback`.
 *
 * @param {String} strategy
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} middleware
 * @api public
 */
Kaching.prototype.approve = function(strategy, options, callback) {
  return approve(strategy, options, callback).bind(this);
};

/**
 * Middleware that will process an approved payment using the given `strategy`
 * name, with optional `options` and `callback`.
 *
 * @param {String} strategy
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} middleware
 * @api public
 */
Kaching.prototype.execute = function(strategy, options, callback) {
  return execute(strategy, options, callback).bind(this);
};

/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Kaching();

exports.Strategy = require('./strategy');
