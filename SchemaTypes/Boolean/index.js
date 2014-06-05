module.exports = function(mongoose){
	require('./type')(mongoose);
	return require('./schema')(mongoose);
};
