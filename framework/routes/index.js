var mongoose = require("mongoose");
var utils = require("../utils.js");
var fs = require("fs");
var async = require("async");

var routeInit = require("./generics/routeinit.js");
var setupInfo = require("./generics/setupInfo.js");
var handleValidation = require("./generics/validateRequest.js");
var Render = require("./generics/render.js");
var Redirect = require("./generics/redirect.js");

function preAmble(success){
  return function(req, res, next){
    routeInit(req, res, function(err){
      if(typeof err != "undefined"){
        console.log(err.message);
        return next(err);
      }
      setupInfo(req, res, function(err){
        if(typeof err != "undefined"){
          console.log(err.message);
          return next(err);
        }
        handleValidation(req, res, function(err, valid, path){
          if(typeof err != "undefined")
            valid = false;
          if(!valid)
            return res.render("403");
          success(req, res, next);
        });
      });
    });
  };
}

module.exports =function(app){
  app.get(/^\/?$/, preAmble(function(req,res,next){
    console.log("index");
    var total = 0;
    var modelStats = [];
    async.each(
      mongoose.modelNames(),
      function(modelname, next){
        var model = mongoose.model(modelname);
        model.count({}, function(err, count){
          console.log(JSON.stringify(err));
          console.log(JSON.stringify(count));
          var more = Math.floor(count*Math.random());

          modelStats.push({
            modelName:modelname,
            doccount:count,
            createcount:more+count,
            requestcount:(more+count)*Math.floor(1+Math.random()*3),
            updatecount:Math.floor((more+count)*Math.random()*0.25),
            deletecount:more
          });
          total += count;
          next();
        });
      },function(){
        req.mvc.modelStats = modelStats;
        req.mvc.grandtotal = total;
        Render(req, res, next,"dot/main/index");
      }
    );
  }));
  app.post("/:model/!/:method", preAmble(function(req, res, next){
    if(req.mvc.method == "add")
      return Render("models/page-renderings/add",req,res);
    if(req.mvc.method == "save"){
      return require("./routepeices/edit.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        req.mvc.instance = data;
        Redirect(utils.object2URL(data),req,res);
      });
    }
    if(method == "advanced-search")
      return Render("models/page-renderings/advanced-search",req,res);
    if(method =="search"){
      return require("./routepeices/list.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        req.mvc.instance = data;
        Redirect(utils.object2URL(data),req,res);
      });
    }
    schema = model.schema;
    if(schema.methods.hasOwnProperty(method)){
      return require("./routepeices/method.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        Redirect(utils.object2URL(doc),req,res);
      });
    }
    console.log("can't find it");
    next();
  }));
  app.post("/:model/:instance/!/:method", preAmble(function(req, res, next){
    if(req.mvc.method == "edit")
      return Render("models/page-renderings/edit",req,res);
    if(req.mvc.method == "save"){
      return require("./routepeices/edit.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        res.locals.model.instance = data;
        Render("models/page-renderings/instance",req,res);
      });
    }
    if(method == "delete"){
      return require("./routepeices/delete.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        Redirect(utils.object2URL(req.mvc.model));
      });
    }
    schema = model.schema;
    if(schema.methods.hasOwnProperty(method)){
      return require("./routepeices/method.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        Redirect(utils.object2URL(doc),req,res);
      });
    }
    console.log("can't find it");
    next();
  }));
  app.get("/:model/:instance/:subpath", preAmble(function(req,res,next){
    require("./routepeices/subpath.js")(req, res, function(err){
      if(err){
        console.log(err.message);
        return Redirect(utils.object2URL(model), req, res);
      }
      Render("models/page-renderings/instance",req,res);
    });
  }));
  app.get("/:model/:instance", preAmble(function(req,res,next){
    require("./routepeices/view.js")(req, res, function(err){
      if(err){
        console.log(err.message);
        return Redirect(utils.object2URL(model), req, res);
      }
      return Render("models/page-renderings/instance",req,res);
    });
  }));
  app.get("/:model", preAmble(function(req, res, next){
    return require("./routepeices/list.js")(req,res, function(err, data){
      if(err){
        console.log(err);
        return next(err);
      }
      req.mvc.instances = data;
      Render(req,res, next, "dot/main/model");
    });
  }));
};
