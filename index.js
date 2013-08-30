var initialize = require('./middlewares/initialize'),
    create = require('./middlewares/create');

function Kaching () {
  this._key = 'kaching';
  this._strategies = {};
}

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
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Kaching();

exports.Strategy = require('./strategy');
