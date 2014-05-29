var config = require("../config.json");
var mongoose = require("mongoose");
if(config.hasOwnProperty("debug") && config.debug)
  mongoose.set("debug", config.DEBUG_LOG)

var url = "";
if(!config.hasOwnProperty("database"))
  throw new Error(
    "Database Credentials are Required to use this framework \n"
  + "Please add \"database\" property to your config.json")
if(!config.database.hasOwnProperty("hostname"))
  throw new Error("\"hostname\" is a required \"database\" property in config.json");
if(!config.database.hasOwnProperty("port"))
  throw new Error("\"port\" is a required \"database\" property in config.json");
url = "mongodb://";
if(!config.database.hasOwnProperty("username") || !config.database.hasOwnProperty("password")){
  console.log(
    "No User Name Available. "
  + "When moving to production, its important to create a \n"
  + "\"username\" and \"password\" to keep your data safe");
}else
  url += config.database.username + ":" + config.database.password + "@";
url += config.database.hostname + ":" + config.database.port + "/" + config.database.db;

if(config.database.hasOwnProperty("options"))
  mongoose.connect url, mongo_options
else
  mongoose.connect url
db = mongoose.connection

db.on "error", (error) ->
  logger.error "ERROR connecting to: " + mongourl, logCategory
  callback error, null

db.on "connected",  ->
  logger.info "SUCCESSFULLY connected to: " + mongourl, logCategory
  callback null, db

db.on "disconnected", ->
  logger.info "DISCONNECTED from the database: " + mongourl, logCategory

module.export = db;
