var mongoose = require("mongoose");
var plugins = require("../../plugin.js");

plugins.initiateFilter("validateRequest");

module.exports = function(req, res, next){
  plugins.emit( "validateRequest", req,res, function(err,valid){
    if(err){
      console.log("validateRequest Erros");
      for(var i=0;i<err.length;i++)
        console.log(err[i].message);
      return res.redirect("/");
    }
    for(var i=0;i<valid.length;i++)
      if(!valid[i])
        return res.redirect("/");
    next();
  });
}
