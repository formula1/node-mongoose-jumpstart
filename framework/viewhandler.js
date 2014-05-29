var doT = require("dot");
var fs = require("fs");
var path2dots = {};
var cheerio = require("cheerio");
var utils = require("./utils");

var include = function(path, data){
  return doT.template(fs.readFileSync(process.cwd() + "/"+path))(data);
}

var enqueScript = function(scriptpath, footer){
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
}

var runPath = function(path, args, next){
  args.enqueScript = enqueScript;
  args.include = include;
  args.utils = utils;
  var $ = cheerio.load(path2dots[path](args));
  if(typeof data._eqs != "undefined"){
    for(var i=0;i<data._eqs.length){
      if(data._eqsfoot.indexOf(data._eqs[i]) != -1)
        $('body').append(
          "<script src=\""+data._eqs[i]+"\" type=\"text/javascript\" ></script>"
        );
      else
        $('head').append(
          "<script src=\""+data._eqs[i]+"\" type=\"text/javascript\" ></script>"
        );
    }
  }
  next(void(0),$.html());
}

module.exports = function(path,args,next){
  if(!path2dots.hasOwnProperty(path))
    return fs.readFile(path, function read(err, data) {
      path2dots[path] = doT.template(data);
      runPath(path,args,next);
    });
  runPath(path,args,next);
}
