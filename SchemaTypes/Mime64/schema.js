var util = require('util');
var mime = require("mime");
var Mime64 = require("./Mime64.js");

module.exports = function(mongoose, supported_mimes, name){
	var CastError   = mongoose.Error.CastError;
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
		SchemaType.call(this, key, options, name);
		this.get(function(val, self){
		//throw new Error(arguments.length)
			if(typeof val == "undefined" || val === null){
				return void(0);
			} else {
				return new Mime64(val);
			}
		});
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
		return !!(value);
	};

	/**
	 * Casts to date
	 *
	 * @param {Object} value to cast
	 * @api private
	 */

	newSchema.prototype.cast = function (value) {

		/*
		There aare two methods of storing the picture here
		1) Storing combo as a json object, Object as Buffer, mimetype as string
		2) Storing combo as a String, object as Base64 and specifying mimetype in header

		2 is easier for now

		Additionally by making a seperate Object I may convert as I need to

		*/
		try{
			if(typeof value == "string"){
				if(value.length < 100 && fs.existsSync(value)){
					var stats = fs.statSync(value);
					if(stats.isDirectory())
						throw new CastError("Mime64: Cannot store a directory into MongoDB",value,this.path)
					var mimetype = mime.lookup(value);
					if(!mimetype.match(supported_mimes))
						throw new CastError(
							"Unsupported mimetype.\n"+
							"If you would like to support the mimetype: "+mimetype+","+
							" please add the mimetype to the second argument when you are defining the schema"
							,value,this.path
						);
					var header = "data:"+mimetype+";base64, ";
					var size = stats.size;
					if(size > 3000000-header.length*8)
						throw new CastError("Can't store a file greater than "+size+" of mimetype "+mimetype,value,this.path)
					var tmp = new Buffer(0);
					fs.readSync(value, tmp, 0, size, 0);
					return header+tmp.toString("base64");
				}
			}
			var ob = new Mime64(value);
		}catch(e){
			console.log("cast err"+e.message);
			throw new CastError(e.message,value,this.path);
		}
		if(!ob.mimetype.match(supported_mimes)){
			throw new CastError(
				"Unsupported mimetype.\n"+
				"If you would like to support the mimetype: "+ob.mimetype+","+
				" please add the mimetype to the second argument when you are defining the schema"
				,value,this.path
			);
		}
		if(ob.size > 3000000-ob.mimetype.length*8)
			throw new CastError("Can't store a file greater than "+(3000000-ob.mimetype.length*8)+" of mimetype "+ob.mimetype,value,this.path)
		return ob.asSource();
	};

	/*!
	 * Query casting.
	 *
	 * @api private
	 */
	function handleSingle (val) {
		return this.cast(val);
	}

	function handleArray (val) {
		var self = this;
		return val.map(function (m) {
			return self.cast(m);
		});
	}

	newSchema.prototype.$conditionalHandlers = {
		'$all' : handleArray,
		'$gt'  : handleSingle,
		'$gte' : handleSingle,
		'$in'  : handleArray,
		'$lt'  : handleSingle,
		'$lte' : handleSingle,
		'$ne'  : handleSingle,
		'$nin' : handleArray
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
			handler = newSchema.$conditionalHandlers[$conditional];

			if (handler) {
				return handler.call(this, val);
			}

			return this.cast(val);
		}

		return this.cast($conditional);
	};


	return newSchema;
};
