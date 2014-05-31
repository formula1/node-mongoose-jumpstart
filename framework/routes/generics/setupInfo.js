var mongoose = require("mongoose");
var async = require("async");
module.exports = function(req, res, next){
  req.mvc = {};
  if(!req.params.hasOwnProperty("model")){
    req.mvc.modelStats = {};
    var grandtotal = 0;
    async.map(
      mongoose.modelNames(),
      function(modelname, next){
          getModelStats(modelname, function(err, obj){
            if(err)
              return next(err);
            grandtotal += obj.doccount;
            next(void(0), obj);
          });
      },function(err, results){
        if(err)
          throw new Error("modelstats");
        req.mvc.modelStats = results;
        req.mvc.grandtotal = total;
        next();
      }
    );
    return;
  }
  req.mvc.model = mongoose.model(req.params.model);
  req.mvc.args = {};
  if(req.params.hasOwnProperty("instance")){
    return mongoose.findOne({_id:req.params.instance}, function(err, doc){
        if(err)
          return next(err);
        if(typeof doc == "undefined")
          return next(new Error("this doc does not exist"));
        req.mvc.instance = doc;
        if(req.params.hasOwnProperty("method"))
          return handleMethod(req, req.mvc.model.schema,next);
        req.mvc.method = "view";
        next();
    });
  }else if(req.params.hasOwnProperty("method"))
    return handleMethod(req, req.mvc.model.schema,next);
  req.mvc.method = "search";
  getModelStats(req.params.model, function(err, stats){
    req.mvc.modelStats = stats;
    next();
  });
};

function handleMethod(req, schema, next){
  if(req.params.hasOwnProperty("instance"))
    if(schema.methods.hasOwnProperty(req.params.method))
      req.mvc.method = req.params.method;
    else
      return next(new Error("Nonexistant Instance method"));
  else
    if(schema.statics.hasOwnProperty(req.params.method))
      req.mvc.method = req.params.method;
    else
      return next(new Error("Nonexistant Class method"));
  req.mvc.args = collectArgs(req);
  next();
}

function getModelStats(modelname, next){
  var model = mongoose.model(modelname);
  model.count({}, function(err, count){
    if(err)
      return next(err);
    var more = Math.floor(count*Math.random());
    var ret = {
      modelName:modelname,
      doccount:count,
      createcount:more+count,
      requestcount:(more+count)*Math.floor(1+Math.random()*3),
      updatecount:Math.floor((more+count)*Math.random()*0.25),
      deletecount:more
    };
    next(void(0), ret);
  });
}

function collectArgs(req){
  var key;
  if(req.method.toUpperCase() == "GET")
    for(key in req.query)
      req.mvc.args[key] = decodeURIComponent(req.query[key]);
  else if(req.method.toUpperCase() == "POST")
    for(key in req.body)
      req.mvc.args[key] = decodeURIComponent(req.body[key]);
}
