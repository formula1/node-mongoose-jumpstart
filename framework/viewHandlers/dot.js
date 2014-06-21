var doT = require("dot");
var fs = require("fs");
var path2dots = {};
var cheerio = require("cheerio");
var utils = require("../utils");
var _ = require("underscore");
var mpath = require("mpath");


function cloner(args){
  for(var i in args)
    this[i] = args[i];
}

cloner.prototype.include = function(path, data){
  return doT.template(fs.readFileSync(path))(data);
};

cloner.prototype.utils = utils;
cloner.prototype._ = _;
cloner.prototype.mpath = mpath;


cloner.prototype.enqueScript = function(scriptpath, footer){
  /*
    the most important things for the scripts is...
    1) We dont repeat scripts
    2) Each script either goes in header or footer
    3) All scripts can retrieve dependencies properly
    4) Each script may take server parameters (I'll worry about this later)
  */
  if(!this.hasOwnProperty("_eqs"))
    this._eqs = [];
  if(this._eqs.indexOf(scriptpath) != -1)
    return;
  this._eqs.push(scriptpath);
  if(typeof footer != "undefined" && footer)
    this._eqsfoot.push(scriptpath);
};

cloner.prototype.enqueStyle = function(scriptpath, footer){
  /*
    the most important things for the scripts is...
    1) We dont repeat scripts
    2) Each script either goes in header or footer
    3) All scripts can retrieve dependencies properly
    4) Each script may take server parameters (I'll worry about this later)
  */
  if(!this.hasOwnProperty("_eqst"))
    this._eqst = [];
  if(this._eqst.indexOf(scriptpath) != -1)
    return;
  this._eqst.push(scriptpath);
  if(typeof footer != "undefined" && footer)
    this._eqstfoot.push(scriptpath);
};


cloner.prototype.mongooseUI = function(path, instance, isInput){
  if(isInput == "input" || isInput === true)
    isInput = "input";
  else
    isInput = "view";
  var type;
  if(path.hasOwnProperty("caster"))
    type = "Array";
  else
    type = path.instance;

  if(typeof type == "undefined")
    throw new Error(JSON.stringify(path));

  console.log()
  var value = (typeof instance != "undefined")?mpath.get(path.path,instance):void(0);


  return doT.template(fs.readFileSync(
      __root+"/views/dot/path-renderings/"
      +isInput+"/"+type+".dot"
  ))(new cloner({path:path,value:value,instance:instance}));

};


var runPath = function(path, args, next){
  var cloned = new cloner(args);
  cloned.content = path;
  var content = doT.template(fs.readFileSync(__root+"/views/dot/layout.dot"))(cloned);
  var $ = cheerio.load(content);
  if(cloned.hasOwnProperty("_eqst")){
    for(var i=0;i<cloned._eqst.length;i++){
      $('head').append(
        "<link rel=\"stylesheet\" type=\"text/css\" href=\""+cloned._eqs[i]+"\" />"
      );
    }
  }
  if(cloned.hasOwnProperty("_eqs")){
    for(var i=0;i<cloned._eqs.length;i++){
      if(cloned._eqsfoot && cloned._eqsfoot.indexOf(cloned._eqs[i]) != -1)
        $('body').append(
          "<script src=\""+cloned._eqs[i]+"\" type=\"text/javascript\" ></script>"
        );
      else
        $('head').append(
          "<script src=\""+cloned._eqs[i]+"\" type=\"text/javascript\" ></script>"
        );
    }
  }
  next(void(0),$.html());
};

module.exports = runPath;
