var Context = require('../context/context'),
    actions = require('../context/actions');

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
    var prototype = kaching._strategies[name];
    if (!prototype) { throw new Error('no strategy registered under name: ' + name); }

    // Create a new strategy object base on the given one.
    // Bind actions with context to the strategy.
    var strategy = Object.create(prototype);
    var context = new Context(null, req, res, next);
    augment(strategy, actions, context);

    // Prepare strategy session namespace
    req._kaching.session[name] = req._kaching.session[name] || {};
    strategy.session = req._kaching.session[name];

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
