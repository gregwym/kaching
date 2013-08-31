var initStrategy = require('./initStrategy');

/**
 * Create a payment.
 *
 * @param {String} name
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} middleware
 * @api public
 */
module.exports = function(name, options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  // Construct and return the middleware function.
  return function create(req, res, next) {
    // Find the specified strategy
    var kaching = this;
    var strategy = initStrategy(kaching, name, res, req, next);

    // Execute create
    strategy.create(req.payment || req.body, options, function(err, payment) {
      if (payment) { req.payment = payment; }
      if (callback) { callback(err, payment); }
    });
  };
};

var augment = function(strategy, actions, ctx) {
  for (var method in actions) {
    strategy[method] = actions[method].bind(ctx);
  }
};
