var express = require("express");
var fs = require("fs");
module.exports = function(config, debug,next){
if(debug)
  process.env.DEBUG = 'express:*';
if(typeof config.cache_age == "undefined")
config.cache_age = 0;

var app = express();
//var session = require("express-session");
//var MongoStore = require("connect-mongo")(session);


console.log(fs.readdirSync(__root+"/public/js"));


app.use(function(req,res,next){
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  next();
});

//======Set Static Files=====
var favicon = require('serve-favicon');

app
  .use(favicon(__root + '/public/images/favicon.ico'))
  .use( '/bower_components', express.static( __root+"/bower_components") )
  .use( '/css', express.static( __root+"/public/css") )
  .use( '/js', express.static( __root+"/public/js") )
  .use( '/images', express.static( __root+"/public/images") )
  .use( '/font', express.static( __root+"/public/font") )
;

//======Default to handling requests=====
app
  .use( require("compression")() )
  .use( require("method-override")() )
  .use( require("body-parser")() )
;

//=====ClientSide==========
app
//  .use( require("csurf")() ) //Cleints can only post data when allowed
//  .use( require("connect-flash")() ) //Server send responses at whim
  .use(require("express-device").capture() ) //for rendering according to device
  .use(function(req, res, next){
    res.locals = {
//      csrf_token: req.csrfToken(),      //needed for csrf support
//      messages: req.flash("info"),      //for connect-flash
      device: req.device.type          //device type
    };
    next()
  })
;
//Messages
//Device Detection
//Locals

//=====Rendering==========
app
  .set('views', __dirname+"/../views")
  .set('view engine', 'dot')
;
fs.readdirSync(__dirname+"/viewHandlers").forEach(function(file){
  var extention = "";
  if(file.indexOf(".") != -1)
    extention = file.substring(0,file.indexOf("."));
  else
    extention = file;
  app.engine(extention,require(__dirname+"/viewHandlers/"+file));
});

//=====Routing==========
require("./routes")(app,function(){
  //======Error Handler==========
  app
    .use( require("errorhandler")( { dumpException: true,  showStack: true } ) )
  ;
  app.listen(config.port, config.hostname, function() {
    console.log("Listsening at "+config.hostname+":"+config.port);
  });
  next(app);

});

}
