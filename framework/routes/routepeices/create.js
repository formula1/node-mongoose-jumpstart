var utils = require ("./utils.coffee");
var mongoose = require("mongoose");

function parse_params( model, params, next){
  schema = model.schema;
  required = schema.requiredPaths();
  topass = {};
  err = [];
  for(var key in schema.paths){
    if(key.match(/^_|_$/))
      continue
    if(typeof params[key] != "undefined" && params[key] != "" && params[key] != null)
      topass[key] = params[key]
    else if(schema.paths[key].isRequired)
      err.push new Error("Missing a required value:"+key);
  }
  if(err.length == 0){
    console.log("NO ERRORS")
    err = void(0)
  }
  next(err, topass)
}

module.exports = function(req, res, next){
  utils.parse_params(req.mvc.model, req.mvc.query, function(err, topass){
    if(err)
      return next(ret_err, topass);
    var instance = new model(topass);
    instance.save(function(err, instance){
      if(err)
        return next([err], topass);
      next(undefined,instance)
    });
  });
};
