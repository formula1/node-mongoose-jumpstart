var plugins = require("../../plugin.js");
plugins.initiateFilter("preRender");

module.exports = function(req, res, next, path){
  plugins.emit("preRender", req, res, function(err, ret){
    if(err){
      for(var i=0;i<err.length;i++)
        console.log(err[i].message);
      return next(new Error("preRender Plugin Errors"));
    }
    res.render(path, {mvc:req.mvc});
  });
}
