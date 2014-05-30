var mongoose = require("mongoose");

function req_parse_params(model, params, next){
  //I should also make it validate path types
  //or not at all, we will see...
  indexes = model.schema.indexes();
  paths = model.schema.paths;
  si = [];
  toRegex = [];
  toStrict = [];
  err = [];
  to_return = {};
  //Check for Regex Properties
  if(params.hasOwnProperty("regex"))
    try{
      toRegex = JSON.parse(value);
    }catch(e){
      err.push(e);
      //regex is not properly formatted
    }
  if(params.hasOwnProperty("strict")){
    try{
      toStrict = JSON.parse(value);
    }catch(e){
      err.push(e);
      //The Strict Parameter is not properly formatted
    }
  }
  if(params.hasOwnProperty("sort"))
    if(paths.hasOwnProperty(params["sort"]))
      to_return._sort = params["sort"];
    else{
      err.push(new Error("Can't sort by a nonexistant property"));
      to_return._sort = "_id"
    }
  else
    to_return._sort = "_id"
  if(params.hasOwnProperty("page"))
    if(params["page"].match(/[0-9]+/))
      to_return._page = params["page"]
    else{
      err.push(new Error("The page must be a number"));
      to_return._page = "0"
    }
  else
    to_return._page = "0"
  if(params["ipp"])
    if(params["ipp"].match(/[0-9]+/))
      if(params["ipp"] > 0)
        to_return._ipp = params["ipp"]
      else{
        err.push(new Error("Items per page must be greater than 0"));
        to_return._ipp = "10"
      }
    else{
      err.push(new Error("Items per page must be a number"));
      to_return._ipp = "10"
    }
  else
    to_return._ipp = "10"
  for(key in paths){
    if(!params.hasOwnProperty(key) || (params[key] == "" && toStrict.indexOf(key) == -1))
      continue
    if(toRegex.indexOf(key) != -1)
      to_return[key] = new RegExp(params[key])
    else if(toStrict.indexOf(key) != -1)
      to_return[key] = params[key]
    else if(typeof params.key != "string")
      to_return[key] = params[key]
    else
      to_return[key] = new RegExp("*"+params[key]+"*")
  }
  if(err.length == 0)
    err = void(0);
  process.nextTick ()->
    next(err, to_return)
}

module.exports = function(req, res, next){
  ret_err = []
  console.log("searching for"+JSON.stringify(params))
  req_parse_params(req.mvc.model, req.mvc.params, function(err, topass){
    if(err)
      next(err, topass);
    var sort = topass._sort;
    delete topass._sort;
    var page = topass._page;
    delete topass._page;

    var ipp = topass._ipp;
    delete topass._ipp;

    model.find(topass).sort(sort).skip(page * ipp).limit(ipp).exec(function(err, instances){
      if err
        next [err], topass
        return
      next(void,instances, topass);
    });
  });
}
