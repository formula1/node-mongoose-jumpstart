var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  var config = require("./config.json");
  global.__root = __dirname;

  if(typeof config.debug != "boolean")
    config.debug = false;
  var app;
  var db = require("./framework/database.js")(config.mongo,config.debug, function(){
    require("./framework/express-combat.js")(config.express,config.debug, function(the_app){
      app = the_app;
    });
  });
}
