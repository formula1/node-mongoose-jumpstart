var plugins = require("../../plugin.js");
plugins.initiateFilter("preRedirect");

module.exports = function(path,req,res){
  plugins.emit( "preRedirect", req, res, function(err, req, res){
    if(err){
      for(var i=0;i<err.length;i++)
        console.log(err[i].message);
    }
    res.redirect(path);
  });
}
