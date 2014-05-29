var config = require("./config.json");

if(typeof config.debug != "boolean")
  config.debug = false;

var db = require("./framework/database.js")(config.mongo,config.debug);
var app = require("./framework/express-combat.js")(config.express,config.debug);
