var mongoose = require("mongoose");
var fs = require("fs");


module.exports = function(config,debug,next){
mongoose.set("debug", debug)
var url = "";
if(typeof config.hostname != "string")
  throw new Error(
    "\"hostname\" is a required \"database\" property in config.json"
  );
if(typeof config.port != "number")
  throw new Error(
    "\"port\" is a required \"database\" property in config.json"
  );
url = "mongodb://";
if(typeof config.userinfo == "undefined"){
  console.log(
    "No User Name Available. "
  + "When moving to production, its important to create a \n"
  + "\"username\" and \"password\" to keep your data safe"
  );
}else
  url += config.userinfo.username + ":" + config.userinfo.password + "@";

url += config.hostname + ":" + config.port + "/" + config.database;

if(typeof config.options != "undefined")
  mongoose.connect(url, config.options);
else
  mongoose.connect(url);
var db = mongoose.connection;
var fs = require("fs");


db.on( "error", function(error){
  console.log("ERROR connecting to: " + url)
  throw error;
});
db.on("connected",function(){
  console.log("SUCCESSFULLY connected to: " + url);

fs.readdirSync(__dirname+"/../SchemaTypes").forEach(function(file){
  require(__dirname+"/../SchemaTypes"+"/"+file)(mongoose);
});
fs.readdirSync(__dirname+"/../models").forEach(function(file){
  require(__dirname+"/../models"+"/"+file);
});
  if(typeof next != "undefined")
    return next(mongoose);
  else
    return db;
});
db.on("disconnected", function(){
  console.log("DISCONNECTED from the database: " + url);
});

};
