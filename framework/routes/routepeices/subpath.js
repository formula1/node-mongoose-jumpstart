var mongoose = require("mongoose");

module.exports = function(req, res, next){
  var model = mongoose.model(req.params.model);
  var find = {};
  var paths = model.schema.paths;
  var to_pop = "";
  path = paths[req.params.subpath]
  if(!key.match(/^_/))
    if(path.hasOwnProperty("caster"))
      to_pop += (path.caster.instance == "ObjectID")?path.path + " ":"";
    else
      to_pop += (path.instance == "ObjectID")?path.path + " ":"";
    next();
}
