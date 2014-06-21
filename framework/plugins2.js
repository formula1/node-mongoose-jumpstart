var async = require("async");
var SortedList = require("sortedlist");

var ioListeners = {};
var eventListeners = {};
var tintListeners = {};


function emitEvent(event){
  if(!(event in eventListeners))
    return;
  arguments.shift();
  arguments.unshift(eventListeners[event]);
  arguments.push(function(err, results){
    if(err)
      console.log(err);
  });
  async.parrallel.apply(async, arguments);
}

function emitEvent(event){
  if(!(event in eventListeners))
    return;
  arguments.shift();
  arguments.unshift(eventListeners[event]);
  arguments.push(function(err, results){
    if(err)
      console.log(err);
  });
  async.parrallel.apply(async, arguments);
}

//each party thats listing to this event gets a clone of the original object
//they are expected to give nothing in return
function eventListener(event, callback){
    if(!(event in eventListeners)){
      eventListeners[event] = [callback];
      return;
    }
    eventListeners[event].push(callback);
}

//each party thats listining to this event gets the original object
//they aren't expected to change the object
//they are expected to return a value or none
function ioListener(event, callback){
  if(!(event in eventListeners)){
    eventListeners[event] = SortedList.create([callback],{compare:function(a,b){
      var aweight;
      var bweight;
      if(typeof a == "function" || !("weight" in a))
        aweight = 0;
      else
        aweight = a.weight;
      if(typeof b == "function" || !("weight" in b))
        var bweight = 0;
      else
        bweight = b.weight;
      return aweight - bweight;
    }});
    return;
  }
  eventListeners[event].insertOne(callback);
}

//each party thats listining to this event gets the original object
//they expected to change it as they please
function tintListener(event, callback){
  if(!(event in eventListeners)){
    eventListeners[event] = SortedList.create([callback],{compare:function(a,b){
      var aweight;
      var bweight;
      if(typeof a == "function" || !("weight" in a))
        aweight = 0;
      else
        aweight = a.weight;
      if(typeof b == "function" || !("weight" in b))
        var bweight = 0;
      else
        bweight = b.weight;
      return aweight - bweight;
    }});
    return;
  }
  eventListeners[event].insertOne(callback);
}
