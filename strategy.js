/**
 * `Strategy` constructor.
 *
 * @api public
 */
function Strategy() {
}

/**
 * Create payment request.
 *
 * This function must be overridden by subclasses.  In abstract form, it always
 * throws an exception.
 *
 * @param {Object} payment
 * @param {Object} options
 * @api protected
 */
Strategy.prototype.create = function(payment, options) {
  throw new Error('Strategy#create must be overridden by subclass');
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
