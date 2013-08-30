var debug = require('debug')('kaching');

/**
 * Export actions prototype for strategies operating within an HTTP context.
 */
var actions = module.exports = {};


/**
 * Redirect to `url` with optional `status`, defaulting to 302.
 *
 * Strategies should call this function to redirect the user (via their user
 * agent) to a third-party website for authentication.
 *
 * @param {String} url
 * @param {Number} status
 * @api public
 */
actions.redirect = function(url, status) {
  var res = this.res;
  if (typeof res.redirect == 'function') {
    // If possible use redirect method on the response
    // Assume Express API, optional status param comes first
    if (status) {
      res.redirect(status, url);
    } else {
      res.redirect(url);
    }
  } else {
    // Otherwise fall back to native methods
    res.statusCode = status || 302;
    res.setHeader('Location', url);
    res.setHeader('Content-Length', '0');
    res.end();
  }
};

/**
 * Pass without making a success or fail decision.
 *
 * Under most circumstances, Strategies should not need to call this function.
 * It exists primarily to allow previous authentication state to be restored,
 * for example from an HTTP session.
 *
 * @api public
 */
actions.pass = function() {
  if (this.next) {
    this.next();
  }
};

/**
 * Internal error while performing authentication.
 *
 * Strategies should call this function when an internal error occurs during the
 * process of performing authentication; for example, if the user directory is
 * not available.
 *
 * @param {Error} err
 * @api public
 */
actions.error = function(err) {
  if (this.next) {
    this.next(err);
  } else {
    debug(JSON.stringify(err));
    throw err;
  }
};
