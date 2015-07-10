var mongoose = require("mongoose");
var async = require("async");
var mpath = require("mpath");
var utils = require("../../utils");
module.exports = function(req, res, next){
  var mns = mongoose.modelNames();
  req.mvc = {};
  if(!req.params.hasOwnProperty("model")){
    req.mvc.modelStats = {};
    var grandtotal = 0;
    async.map(
      mns,
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
        req.mvc.grandtotal = grandtotal;
        next();
      }
    );
    return;
  }
  if(mns.indexOf(req.params.model) == -1)
    return next(new Error("Nonexistsant Model"));
  if(req.params.model.match(/^_/))
    return next(new Error("Hidden Model"));
  req.mvc.model = mongoose.model(req.params.model);
  req.mvc.args = {};
  if(req.params.hasOwnProperty("instance")){
    if(req.params.hasOwnProperty("subpath")){
      if(!req.mvc.model.schema.paths.hasOwnProperty(req.params.subpath))
        return next(new Error("Nonexistant Subpath"));
      if(req.params.subpath.match(/^_|.*\._.*/))
        return next(new Error("Hidden Subpath"));
    }
    return req.mvc.model.findOne({_id:req.params.instance}, function(err, doc){
        if(err)
          return next(err);
        if(typeof doc == "undefined" || doc === null)
          return next(new Error("this doc does not exist"));
        req.mvc.instance = doc;
        if(req.params.hasOwnProperty("subpath")){
          return handleSubpath(req, res, next);
        }else if(req.params.hasOwnProperty("method"))
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

function handleSubpath(req,res, next){
  req.mvc.subpath = mpath.get(req.params.subpath,req.mvc.instance);
  if(req.params.hasOwnProperty("method"))
    return handleMethod(req, req.mvc.subpath,next);
  if(!req.mvc.model.schema.paths[req.params.subpath].hasOwnProperty("caster"))
    req.mvc.method = req.mvc.model.schema.paths[req.params.subpath].caster.instance;
  else
    req.mvc.method = req.mvc.model.schema.paths[req.params.subpath].instance;
  next();

}

function handleMethod(req, schema, next){
  if(req.params.method.match(/^_/))
    return next(new Error("this is a hidden method"));
  if(req.params.hasOwnProperty("subpath")){
    if(!(req.params.method in schema))
      return next(new Error("Nonexsistant Subpath method"))
    if(typeof schema[req.params.method] != "function")
      return next(new Error("This property is not a function"))
    collectArgs(req, schema[req.params.method]);
  }else if(req.params.hasOwnProperty("instance")){
    if(!schema.methods.hasOwnProperty(req.params.method)
    && !req.params.method.match(/edit|save|delete/))
      return next(new Error("Nonexistant Instance method"));
    collectArgs(req, schema.methods[req.params.method]);
  }else{
    if(!schema.statics.hasOwnProperty(req.params.method)
    && !req.params.method.match(/create|save|search|batch/))
      return next(new Error("Nonexistant Class method"));
    collectArgs(req, schema.methods[req.params.method]);
  }
  req.mvc.method = req.params.method;
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

function collectArgs(req, funk){
  if(req.params.method.match(/create|edit|delete/))
    return
  if(req.params.method.match(/save|search|batch/)){
    if(req.method.toUpperCase() == "GET")
      req.mvc.args = req.query;
    else if(req.method.toUpperCase() == "GET")
      req.mvc.args = req.body;
    return;
  }
  var argsnames = utils.getArgs(funk);
  var key;
  if(req.method.toUpperCase() == "GET")
    for(key in funk)
      if(req.query.hasOwnProperty(key))
        req.mvc.args[key] = decodeURIComponent(req.query[key]);
  else if(req.method.toUpperCase() == "POST")
    for(key in funk)
      if(req.body.hasOwnProperty(key))
        req.mvc.args[key] = decodeURIComponent(req.body[key]);
}
