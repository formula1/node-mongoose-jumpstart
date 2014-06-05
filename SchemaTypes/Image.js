var Mime64 = require("./Mime64");

module.exports = function(mongoose){
  return Mime64(mongoose, /^image/, "Image");
}
