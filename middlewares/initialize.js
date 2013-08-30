/**
 * Kaching initialization.
 *
 * Intializes Kaching for incoming requests
 *
 * Note that additional middleware is required to persist login state, so we
 * must use the `connect.session()` middleware _before_ `kaching.initialize()`.
 *
 * This middleware must be in use by the Connect/Express application for
 * Kaching to operate.
 *
 * Examples:
 *
 *     app.configure(function() {
 *       app.use(connect.cookieParser());
 *       app.use(connect.session({ secret: 'keyboard cat' }));
 *       app.use(kaching.initialize());
 *     });
 *
 * @return {Function}
 * @api public
 */
module.exports = function() {

  return function initialize(req, res, next) {
    var kaching = this;
    req._kaching = {};
    req._kaching.instance = kaching;

    if (req.session && req.session[kaching._key]) {
      // load data from existing session
      req._kaching.session = req.session[kaching._key];
    } else if (req.session) {
      // initialize new session
      req.session[kaching._key] = {};
      req._kaching.session = req.session[kaching._key];
    } else {
      // no session is available
      req._kaching.session = {};
    }

    next();
  };
};
