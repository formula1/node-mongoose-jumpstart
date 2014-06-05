var util = require('util');

module.exports = function(mongoose){
	var CastError   = mongoose.Error.CastError;
	var SchemaTypes = mongoose.SchemaTypes;
	var SchemaType  = mongoose.SchemaType;

	/**
	 * Moment SchemaType constructor.
	 *
	 * @param {String} key
	 * @param {Object} options
	 * @inherits SchemaType
	 * @api private
	 */

	function newSchema(key, options) {
		SchemaType.call(this, key, options, "Boolean");
	};

	/*!
	 * Inherits from SchemaType.
	 */

	 util.inherits(newSchema, mongoose.SchemaType);

	/**
	 * Required validator for date
	 *
	 * @api private
	 */

	newSchema.prototype.checkRequired = function (value) {
		return value === true || value === false;
	};

	/**
	 * Casts to date
	 *
	 * @param {Object} value to cast
	 * @api private
	 */

	newSchema.prototype.cast = function (value) {
		if (null === value) return value;
		if ('0' === value) return false;
		if ('true' === value) return true;
		if ('false' === value) return false;
		return !! value;
	};

	/*!
	 * Date Query casting.
	 *
	 * @api private
	 */

	function handleArray (val) {
		var self = this;
		return val.map(function (m) {
			return self.cast(m);
		});
	}

	newSchema.prototype.$conditionalHandlers = {
		'$in': handleArray
	};


	/**
	 * Casts contents for queries.
	 *
	 * @param {String} $conditional
	 * @param {any} [value]
	 * @api private
	 */

	newSchema.prototype.castForQuery = function ($conditional, val) {
		var handler;
		if (2 === arguments.length) {
			handler = SchemaBoolean.$conditionalHandlers[$conditional];

			if (handler) {
				return handler.call(this, val);
			}

			return this.cast(val);
		}

		return this.cast($conditional);
	};

	/*!
	 * Module exports.
	 */

	if (SchemaTypes.Boolean) {
		var msg = 'Overriding Previous Boolean'
		console.log(msg);
	}

	return SchemaTypes.Boolean = newSchema;
};
