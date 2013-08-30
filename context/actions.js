var debug = require('debug')('kaching');

/**
 * Export actions prototype for strategies operating within an HTTP context.
 */
var actions = module.exports = {};


/**
 * Redirect to `url` with optional `status`, defaulting to 302.
 *
 * Strategies should call this function to redirect the user (via their user
 * agent) to a third-party website to continue the process.
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
 * Pass to next request handler.
 *
 * Strategies should call this function when all the jobs has been completed,
 * and want to give control to the following up request handler. Mostly used
 * in middlewares.
 *
 * @api public
 */
actions.pass = function() {
  if (this.next) {
    this.next();
  }
};

/**
 * Internal error.
 *
 * Strategies should call this function when an internal error occurs during the
 * process. For example, paypal return 400 bad request.
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
