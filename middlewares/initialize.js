/**
 * Cashier initialization.
 *
 * Intializes Cashier for incoming requests
 *
 * Note that additional middleware is required to persist login state, so we
 * must use the `connect.session()` middleware _before_ `cashier.initialize()`.
 *
 * This middleware must be in use by the Connect/Express application for
 * Cashier to operate.
 *
 * Examples:
 *
 *     app.configure(function() {
 *       app.use(connect.cookieParser());
 *       app.use(connect.session({ secret: 'keyboard cat' }));
 *       app.use(cashier.initialize());
 *     });
 *
 * @return {Function}
 * @api public
 */
module.exports = function() {

  return function initialize(req, res, next) {
    var cashier = this;
    req._cashier = {};
    req._cashier.instance = cashier;

    if (req.session && req.session[cashier._key]) {
      // load data from existing session
      req._cashier.session = req.session[cashier._key];
    } else if (req.session) {
      // initialize new session
      req.session[cashier._key] = {};
      req._cashier.session = req.session[cashier._key];
    } else {
      // no session is available
      req._cashier.session = {};
    }

    next();
  };
};
