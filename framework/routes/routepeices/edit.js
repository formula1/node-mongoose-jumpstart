var mongoose = require("mongoose");

function update_parse_params( model, params, next){
  schema = model.schema;
  topass = {}
  for( var key in schema.path)
    if(key.match(/^_|_$/))
      continue;
    if(typeof params[key] != "undefined")
      topass[key] = params[key];
  process.nextTick(function(){
    next(topass);
  });
}

module.exports = function(req, res, next){
  update_parse_params(req.mvc.model,req.mvc.args,function(topass){
    ret_err = []
    for(key in topass)
      req.mvc.instance[key] = topass[key];
    req.mvc.instance.save(function(err, instance){
      if(err)
        return next([err],topass);
      next(void(0), instance);
    });
  });
}
