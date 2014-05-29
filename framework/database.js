var mongoose = require("mongoose");

module.exports = function(config,debug){
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

db.on( "error", function(error){
  console.log("ERROR connecting to: " + url)
});
db.on("connected",function(){
  console.log("SUCCESSFULLY connected to: " + url);
});
db.on("disconnected", function(){
  console.log("DISCONNECTED from the database: " + url);
});
return db;
}
