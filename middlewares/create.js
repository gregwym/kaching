var Context = require('../context/context'),
    actions = require('../context/actions');

/**
 * Create a payment.
 *
 * @param {String} name
 * @param {Object} options
 * @param {Function} callback
 * @return {Function}
 * @api public
 */
module.exports = function(name, options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  return function create(req, res) {
    var cashier = this;
    var prototype = cashier._strategies[name];
    if (!prototype) { throw new Error('no strategy registered under name: ' + name); }

    var strategy = Object.create(prototype);
    var context = new Context(null, req, res, null);
    augment(strategy, actions, context);

    if (!req._cashier.session[name]) { req._cashier.session[name] = {}; }
    strategy.session = req._cashier.session[name];
    strategy.create(req.payment || req.body, options);
  };
};

var augment = function(strategy, actions, ctx) {
  for (var method in actions) {
    strategy[method] = actions[method].bind(ctx);
  }
};
