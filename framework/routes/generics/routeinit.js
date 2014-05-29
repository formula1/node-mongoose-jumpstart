var mongoose = require("mongoose");
var plugins = require("../../framework.plugin.js");

plugins.initiateFilter("preData");


module.exports = function routeInit(req,res,next){
  names = mongoose.modelNames()
  if(names.indexOf(req.params.model) == -1)
    return next("nonexistant");
  if(req.params.model.match(/^_/))
    return next("hidden model");
  model = mongoose.model(req.params.model)
  if(req.params.hasOwnProperty("method"))
    if(req.params.method.match(/^_/))
      return next("hidden method");
  plugins.emit("preData", req, res, function(err_arr){
    if(err_arr)
      console.log("PreData Plugin Errors");
      for(var i=0;i<err_arr.length;i++)
        console.log(err_arr[i].message);
      return next("PreData Errors");
    next();
  });
}
