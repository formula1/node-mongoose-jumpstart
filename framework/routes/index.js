var mongoose = require("mongoose");
var utils = require("../utils.js")
var fs = require("fs");


var plugins = require("../plugin");
var boo = true;
if(boo){
  checker = function(path){
    fs.readdirSync(path).forEach(function(file){
      stats = fs.statSync(path+"/"+file);
      if(stats.isDirectory())
        checker(path+"/"+file);
      else
        try{
          require(path+"/"+file);
        }catch(e){
          console.log("Model Error["+path+"/"+file+"]: "+e);
        }
    });
  }
  checker(process.cwd()+"/models");
  boo = false;
}

var routeInit = require("./generics/routeinit.js");
var setupInfo = require("./generics/setupInfo.js");
var handleValidation = require("./generics/validateRequest.js");
var Render = require("./generics/render.js");
var Redirect = require("./generics/redirect.js");

module.exports =function(app){
  app.use(routeInit);
  app.use(setupInfo);
  app.use(handleValidation);

  app.get("/", function(req,res,next){
    var models = mongoose.modelNames();
    next();
  });
  app.get("/:model/:instance/", function(req,res,next){
    require("routepeices/view.js")(req, res, function(err){
      if(err){
        console.log(err.message)
        return Redirect(utils.object2URL(model), req, res)
      }
      return Render("models/page-renderings/instance",req,res);
    });
  });
  app.post("/:model/:instance/:method", function(req, res, next){
    if(req.mvc.method == "edit")
      return Render("models/page-renderings/edit",req,res)
    if(req.mvc.method == "save")
      return require("routepeices/edit.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        res.locals.model.instance = data
        return Render("models/page-renderings/instance",req,res)
      });
    if(method == "delete")
      return require("routepeices/delete.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        return Redirect(utils.object2URL(req.mvc.model));
      });
    schema = model.schema
    if(schema.methods.hasOwnProperty(method))
      return require("routepeices/method.js")(req,res, function(err, data){
        if(err)
          console.log(err);
          return Redirect(utils.object2URL(doc),req,res)
      });
    console.log("can't find it")
    next();
  });
  app.get("/:model", function(req, res, next){
    return require("routepeices/list.js")(req,res, function(err, data){
      if(err)
        console.log(err);
      Render("models/page-renderings/model", req,res, err)
    });
  });

  app.post("/:model/:method", function(req, res, next){
    if(req.mvc.method == "add")
      return Render("models/page-renderings/add",req,res)
    if(req.mvc.method == "save")
      return require("routepeices/edit.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        res.locals.model.instance = data
        return Redirect(utils.object2URL(data),req,res)
      });
    if(method == "advanced-search")
      return Render("models/page-renderings/advanced-search",req,res)
    if(method =="search")
      return require("routepeices/list.js")(req,res, function(err, data){
        if(err)
          console.log(err);
        res.locals.model.instance = data
        return Redirect(utils.object2URL(data),req,res)
      });
    schema = model.schema
    if(schema.methods.hasOwnProperty(method))
      return require("routepeices/method.js")(req,res, function(err, data){
        if(err)
          console.log(err);
          return Redirect(utils.object2URL(doc),req,res)
      });
    console.log("can't find it")
    next()
  });
}
