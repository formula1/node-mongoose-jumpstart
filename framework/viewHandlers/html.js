var fs = require("fs");

module.exports = function(path,args,next){
  fs.readFile(path, "utf8", function(err,text){
    text += "";
    next(void(0),text);
  });
};
