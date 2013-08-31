var initStrategy = require('./initStrategy');

/**
 * Proceed to approval process.
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
  return function approve(req, res, next) {
    // Find the specified strategy
    var kaching = this;
    var strategy = initStrategy(kaching, name, res, req, next);

    // Let strategy handle the approval process.
    strategy.approve(req.payment, options, function(err, payment) {
      if (payment) { req.payment = payment; }
      if (callback) { callback(err, payment); }
    });
  };
};

