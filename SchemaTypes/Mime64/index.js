var Mime64 = require("./Mime64");

module.exports = function(mongoose, mimes, name){
  SchemaTypes = mongoose.SchemaTypes
  console.log(name);
  if(typeof name != "string")
    name = "Mime64";
  if (SchemaTypes.hasOwnProperty(name)) {
    var msg = 'The Mime64:'+name+' schema type is already registered.\nAre you including it twice?'
    throw new Error(msg);
  }
  if(mimes instanceof Array)
    mimes = new RegExp(mimes.join("|"));
  else if(typeof mimes == "string")
    mimes = new RegExp(mimes);
  else if(mimes instanceof RegExp)
    mimes = mimes;
  else
    mimes = /.*/

  mongoose.Types[name] = Mime64;
  mongoose.Types[name] = Mime64;

  SchemaTypes[name] = require('./schema')(mongoose, mimes, name);
  return SchemaTypes[name];
};
