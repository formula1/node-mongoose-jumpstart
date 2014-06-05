var mongoose = require("mongoose");

module.exports = function(req, res, next){
  var model = mongoose.model(req.params.model);
  var find = {};
  find._id = decodeURIComponent(req.params.instance);
  var paths = model.schema.paths;
  var to_pop = "";
  for(var key in paths){
    path = paths[key]
    if(!key.match(/^_/))
      if(path.hasOwnProperty("caster"))
        to_pop += (path.caster.instance == "ObjectID")?path.path + " ":"";
      else
        to_pop += (path.instance == "ObjectID")?path.path + " ":"";
  }
  to_pop = (to_pop != "")?to_pop.substring(0, to_pop.length - 1):"";
  model.findOne(find).populate(to_pop).exec(function(err,doc){
    if(err){
      next(err);
    }
    if(!doc){
      return next(new Error("doc does not exist"));
    }
    req.mvc.instance = doc
    next();
  });
}
