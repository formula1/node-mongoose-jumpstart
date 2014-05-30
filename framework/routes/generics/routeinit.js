var mongoose = require("mongoose");
var plugins = require("../../plugin.js");

plugins.initiateFilter("preData");


module.exports = function routeInit(req,res,next){
  if(req.params.hasOwnProperty("model")){
    names = mongoose.modelNames();
    if(names.indexOf(req.params.model) == -1)
      return next(new Error("nonexistant"));
    if(req.params.model.match(/^_/))
      return next(new Error("hidden model"));
    model = mongoose.model(req.params.model)
    if(req.params.hasOwnProperty("method"))
      if(req.params.method.match(/^_/))
        return next(new Error("hidden method"));
  }
  plugins.emit("preData", req, res, function(err_arr){
    if(err_arr){
      for(var i=0;i<err_arr.length;i++)
        console.log(err_arr[i].message);
      return next(new Error("PreData Errors"));
    }
    next();
  });
}
