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

function getPlugins(){
  var plugins = [];
  fs.readdirSync(process.cwd() + "/app/plugins").forEach(function(file){
      if(!file.match("^index"))
        plugins.push require(process.cwd() + "/app/plugins/"+file)
  });
  return plugins;
}

module.exports ={
  initiateFilter: function(command){
    console.log("plugins initiating "+command)
    if(hooks.hasOwnProperty(command)
      throw new Error("initiating command: "+command+"twice");
    var plugins = getPlugins();
    var commands = [];
    while(plugins.length>0){
      if(!plugins[0].hasOwnProperty(command))
        commands.push(plugins[0][command]);
      plugins.unshift();
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
    `
    console.log("count="+commands.length)
    hooks[command] = commands
  },
  emit: function(){
    if(!hooks.hasOwnProperty(arguments[0]))
      return arguments[arguments.length-1](new Error("This command hasn't been initiated"));
    var the_args = Array.slice(arguments)
    var command = arguments.splice(0,1);
    var callback = arguments.splice(this.arguments.length-1,1);
    var err_arr = [];
    var returned = [];
    var counter = 0;

    arguments.push(function(){
      var args = Array.slice(arguments);
      var err = args.splice(0,1);
      if(typeof err != "undefined")
        err_arr.push(err)
      if(arguments.length > 0)
        returned.push(this.arguments)
      counter++
      process.nextTick(function(){
        doit();
      });
    });

    (function doit(){
      if(counter == hooks[command].length){
        if(err_arr.length == 0)
          err_arr = void(0);
        if(returned.length == 0)
          returned = void(0);
        process.nextTick(function(){
          callback(err_arr, returned);
        });
        return;
      }
      try{
        hooks[command][counter].apply(void(0), the_args);
      }catch(e){
        err_arr.push(e);
        counter++;
        process.nextTick(function(){
          doit();
        });
      }
    })();

  }
}
