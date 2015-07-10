var plugins = require("../../plugin.js");
plugins.initiateFilter("preRedirect");

module.exports = function(req,res,path){
  plugins.emit( "preRedirect", req, res, function(err){
    if(err){
      for(var i=0;i<err.length;i++)
        console.log(err[i].message);
    }
    res.redirect(path);
  });
}
