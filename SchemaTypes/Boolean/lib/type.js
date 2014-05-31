var Moment = require('moment');

module.exports = function(mongoose){
	mongoose.Types.Boolean = Boolean;
	mongoose.Types.boolean = Boolean;
	return mongoose.Types.Boolean;
};
