var mongoose = require("mongoose");
var plugins = require("../../plugin.js");

plugins.initiateFilter("validateRequest");

module.exports = function(req, res, next){
  plugins.emit( "validateRequest", req,res, function(err,valid,path){
    if(err){
      console.log("validateRequest Erros");
      for(var i=0;i<err.length;i++)
        console.log(err[i].message);
      return next(new Error("ValidateRequest Plugin Errors"));
    }
    for(var i=0;i<valid.length;i++)
      if(!valid[i])
        next(void(0),false,"/")
    next(void(0),true);
  });
}
