var fs = require("fs");
var mongoose = require("mongoose");
var Encoder = require('node-html-encoder').Encoder;

var he = new Encoder("entity");

var utils = {
  string2Model: function(init_string){
    return mongoose.model(init_string);
  },
  htmlEncode: function(text){
    return he.htmlEncode(text);
  },
  getModel: function(object){
    if(object instanceof mongoose.Document)
      return mongoose.model(object.constructor.modelName)
    if(object.hasOwnProperty("modelName"))
      return object
    else
      return
  },
  getUnique: function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for(var i=0;i<8;i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  },
  toPopulate: function(model){
    var find = {};
    var paths = model.schema.paths;
    var to_pop = "";
    for(var key in paths){
      path = paths[key];
      if(!key.match(/^_/))
        if(path.caster)
          to_pop += (path.caster.instance == "ObjectID")?path.path + " ":"";
        else
          to_pop += (path.instance == "ObjectID")?path.path + " ":"";
    }
    to_pop = (to_pop !== "")?to_pop.substring(0, to_pop.length - 1):"";
    return to_pop;
  },
  getArgs: function(func){
    fnStr = func.toString();
    fnStr = fnStr.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
    result = fnStr.slice(
        fnStr.indexOf('(')+1,
        fnStr.indexOf(')')
      ).match(/([^\s,]+)/g);
    if(result === null)
      result = [];
    return result;
  },
  object2URL: function(object){
    if(typeof object == "undefined")
      return false;
    if(object instanceof mongoose.Document){
      model = mongoose.model(object.constructor.modelName);
      return "/"+model.modelName+"/"+object._id;
    }
    else if("modelName" in object)
      return "/"+object.modelName;
    return false;
  }
};

module.exports = utils;
