var initStrategy = require('./initStrategy');

/**
 * Execute an approved payment.
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
  return function execute(req, res, next) {
    // Find the specified strategy
    var kaching = this;
    var strategy = initStrategy(kaching, name, res, req, next);

    // Execute the payment
    strategy.execute(req.payment, options, function(err, payment) {
      if (payment) { req.payment = payment; }
      if (callback) { callback(err, payment); }
    });
  };
};

