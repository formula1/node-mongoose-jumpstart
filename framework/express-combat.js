var express = require("express");

module.exports = function(config, debug){
if(debug)
  process.env.DEBUG = 'express:*';
if(typeof config.cache_age == "undefined")
config.cache_age = 0;

var app = express();
//var session = require("express-session");
//var MongoStore = require("connect-mongo")(session);

//======Set Static Files=====
app
  .use( '/css', express.static( "public/css", config.cache_age) )
  .use( '/js', express.static( "public/js", config.cache_age) )
  .use( '/images', express.static( "public/images", config.cache_age) )
  .use( '/font', express.static( "public/font", config.cache_age) )
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
var viewHandler = require("./viewhandler.js");
app
  .set('views', __dirname+"/../views")
  .engine("dot", viewHandler)
  .engine("html", viewHandler)
;

//=====Routing==========
require("./routes")(app);


//======Error Handler==========
app
  .use( require("errorhandler")( { dumpException: true,  showStack: true } ) )
;
app.listen(config.port, config.hostname, function() {
  console.log("Listsening at "+config.hostname+":"+config.port);
});
return app;
}
