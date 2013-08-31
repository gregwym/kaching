var Context = require('../context/context'),
    actions = require('../context/actions');

module.exports = exports = function(kaching, name, res, req, next) {
  // Find the specified strategy
  var prototype = kaching.strategy(name);

  // Create a new strategy object base on the given one.
  var strategy = Object.create(prototype);
  var context = new Context(null, req, res, next);
  augment(strategy, actions, context);

  // Prepare strategy session namespace
  req._kaching.session[name] = req._kaching.session[name] || {};
  strategy.session = req._kaching.session[name];
  return strategy;
};

var augment = function(strategy, actions, ctx) {
  // Bind actions with context to the strategy.
  for (var method in actions) {
    strategy[method] = actions[method].bind(ctx);
  }
};
