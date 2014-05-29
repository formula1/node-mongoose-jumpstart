var plugins = require("../../plugin.js");
plugins.initiateFilter("preRender");

module.exports = function(path,req, res){
  plugins.emit "preRender", req, res, (err, req, res)->
    if(err){
      for(var i=0;i<err_arr.length;i++)
        console.log(err_arr[i].message);
    }
    res.render(path);
}
