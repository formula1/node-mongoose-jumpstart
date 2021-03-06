/*
Plugins
Pretty much, there is a lot that we can automate in every website
however, there are a few specific things that can often times be very important
to customize. As a result, we create a filter that allows people to customize that
as they desire.

With each plugin, there are a few important things to note
-What comes in, what goes out

what always comes in (args,next)
if you'd like to prevent the plugin from continuing, you may simply not call
next you will need to do everything else from there. However, unless the plugin
specifically gives the response object, you will not be able to return something
to the user

What always goes out
(err,args)
if error is non existant, use void(0)
You may also throw an Error which will be caught if still in a non-anonymous function

Hooks are non-atomic, so if you're throwing an error or return an error, the
rest of the plugins will continue


This is done on a "per request" instance so there is not only 1 plugin object,
but rather its compiled when called.

*/
var fs = require('fs');
var hooks = {};
var async = require("async");
function getPlugins(){
  var plugins = [];
  var array = fs.readdirSync(__dirname+"/../plugins")
  array.forEach(function(file){
      var temp = require(__dirname+ "/../plugins/"+file)
      plugins.push(temp);
  });
  return plugins;
}

module.exports ={
  initiateFilter: function(command){
    console.log("plugins initiating "+command)
    if(hooks.hasOwnProperty(command))
      throw new Error("initiating command: "+command+"twice");
    var plugins = getPlugins();
    var commands = [];
    while(plugins.length>0){
      if(command in plugins[0])
        commands.push(plugins[0][command]);
      plugins.shift();
    }
    commands.sort(
      function(a,b){
        if(!a.hasOwnProperty("weight"))
          a.weight = 1;
        if(!b.hasOwnProperty("weight"))
          b.weight = 1;
        return a.weight-b.weight
      }
    );
    console.log("count="+commands.length);
    hooks[command] = commands;
  },
  emit: function(){
    if(!hooks.hasOwnProperty(arguments[0]))
      return arguments[arguments.length-1]([new Error("This command hasn't been initiated")]);
    the_args = Array.prototype.slice.call(arguments);
    var command = the_args.splice(0,1);
    var callback = the_args.splice(the_args.length-1,1)[0];
    var err_arr = [];
    var ret_arr = [];
    var counter = 0;
    the_args.push(function(){
      var sub_args = Array.prototype.slice.call(arguments);
      var err = sub_args.splice(0,1);
      if(typeof err != "undefined")
        err_arr.push(err)
      if(sub_args.length > 0)
        ret_arr.concat(sub_args)
    });
    async.eachSeries(
      hooks[command],
      function(hook,next){
        try{
          var ret = hook.apply(void(0), the_args);
          if(typeof ret != "undefined")
            ret_arr.push(ret);
        }catch(e){
          err_arr.push(e)
        }
        next();
      },
      function(){
        if(err_arr.length == 0)
          err_arr = void(0);
        process.nextTick(function(){
          console.log(JSON.stringify(callback));
          callback(err_arr, ret_arr);
        });
      }
    );

  }
}
