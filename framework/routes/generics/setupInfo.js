mongoose = require("mongoose");

module.exports = function(req, res, next){
  req.mvc = {};
  if(!req.params.hasOwnProperty("model"))
    return next();
  req.mvc.model = mongoose.model(req.params.model);
  if(req.params.hasOwnProperty("method"))
    req.mvc.method = req.params.method;
  else
    req.mvc.method = (req.params.hasOwnProperty("instance"))?"view":"search";
  req.mvc.args = {};
  if(req.method.toUpperCase() == "GET")
    for(key in req.query)
      req.mvc.args[key] = decodeURIComponent(req.query[key])
  else if(req.method.toUpperCase() == "POST")
    for(key in req.body)
      req.mvc.args[key] = decodeURIComponent(req.body[key])
  if(req.params.hasOwnProperty("instance"))
    return mongoose.findOne({_id:req.params.instance}, function(err, doc){
        if(err)
          return next(err);
        req.mvc.instance = doc;
        next();
    });
  next();
}
