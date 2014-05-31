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
  var db = require("./framework/database.js")(config.mongo,true,populationCreation);
}

function populationCreation(db){
  db.db.dropDatabase();
  var mongoose = require("mongoose");
  var mpath = require("mpath");
  var async = require("async");
  var modelnames = mongoose.modelNames();
  var or = [];//{model_of_property_holder, id_of_property_holder, path_of_property}
  async.each(
    modelnames,
    function(modelname, next){
      var items = Math.random()*100;
      async.times(
        items,
        function(n, snext){
          buildDoc(modelname).save(function(err, doc){
            if(err)
              throw err;
            snext(void(0),doc);
          });
        },
        function(){
          next();
        }
      );
    },
    function(){
      async.eachSeries(
        or,
        function(item, next){
          var ci = item.instance;
          var cp = item.path;
          if(cp.hasOwnProperty("caster")){
            buildOID(cp.caster.options.ref, function(err,doc){
              if(err)
                throw err;
              ci[cp.path].push(doc);
              ci.save(function(err){
                if(err)
                  throw err;
                next()
              });
            });
          }else
            buildOID(cp.options.ref, function(err, doc){
              if(err)
                throw err;
              mpath.set(cp.path,doc._id,ci);
              ci.save(function(err){
                if(err)
                  throw err;
                next();
              });
            });
        },
        function(){
          //done
          mongoose.disconnect();
          console.log("done");
          process.exit(1);
        }
      );
    }
  );

  function buildOID(modelname, next){
    var model = mongoose.model(modelname)
    model.count(function(err, count) {
      if (err) {
        throw err;
      }
      var rand = Math.floor(Math.random() * count);
      model.findOne().skip(rand).exec(next);
    });
  }

  function buildDoc(modelname){
    var model = mongoose.model(modelname);
    var paths = model.schema.paths;
    var newDoc = new model();
    function generateValue(path, type){
      var ran = Math.random();
      switch(type){
      case "Mixed":
        var nm = ["Boolean", "Number", "String", "Date", "ObjectID"];
        ran = Math.floor(ran*4);
        return generateValue(nm[ran]);
      case "Boolean":
        return (ran < .5);
      case "Number":
        ran *= 5000;
        return ran
      case "String":
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
        for(var i=0;i<16;i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      case "Date":
        return new Date();
      case "ObjectID":
        or.push({instance:this,path:path});
        return;
      }
    }
    for(var j in paths){
      console.log(j);
      var path = paths[j];
      if(path.path.match(/^_/)) continue;
      if(path.hasOwnProperty("caster")){
        var items = Math.random()*10;
        for(var k=0;k<items;k++){
          var ret = generateValue.call(newDoc, path, path.caster.instance);
          if(typeof ret != "undefined")
            mpath.set(path.path+"."+k,ret,newDoc);
        }

      }else{
        var ret = generateValue.call(newDoc, path, path.instance);
        mpath.set(path.path,ret,newDoc);
      }
    }
    console.log(JSON.stringify(newDoc));
    return newDoc;
  }

}
