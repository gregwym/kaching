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
 * @param {Function} callback
 * @api protected
 */
Strategy.prototype.create = function(payment, options, callback) {
  throw new Error('Strategy#create must be overridden by subclass');
};

/**
 * Proceed to approval process.
 *
 * This function must be overridden by subclasses.  In abstract form, it always
 * throws an exception.
 *
 * @param {Object} payment
 * @param {Object} options
 * @param {Function} callback
 * @api protected
 */
Strategy.prototype.approve = function(payment, options, callback) {
  throw new Error('Strategy#approve must be overridden by subclass');
};

/**
 * Execute an approved payment request.
 *
 * This function must be overridden by subclasses.  In abstract form, it always
 * throws an exception.
 *
 * @param {Object} payment
 * @param {Object} options
 * @param {Function} callback
 * @api protected
 */
Strategy.prototype.execute = function(payment, options, callback) {
  throw new Error('Strategy#execute must be overridden by subclass');
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
