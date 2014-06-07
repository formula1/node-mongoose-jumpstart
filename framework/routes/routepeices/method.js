
function getArgs(func){
  fnStr = func.toString()
  fnStr = fnStr.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
  result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')'))
    .match(/([^\s,]+)/g)
  if(result == null)
    result = []
  return result
}

module.exports = function(req,res,next){
  var ref;
  if(typeof req.mvc.instance == "undefined")
    ref = req.mvc.model;
  else if(typeof req.mvc.subpath != "undefined")
    ref = req.mvc.subpath;
  else
    ref = req.mvc.instance;
  method =  req.mvc.method;
  var argsnames = getArgs(ref[method]);
  var argvalues = [];
  for(var i = 0;i<argsnames.length;i++){
    var name = argsnames[i];
    if(name in req.mvc.args)
      argvalues.push(req.mvc.args[name])
    else if(name.match(/req|request/))
      argvalues.push(req)
    else if(name.match(/res|response/))
      argvalues.push(res)
    else if(name.match(/next|cb|callback/))
      argvalues.push(function(errors){
        if(errors)
          if(Object.prototype.toString.call( errors ) != '[object Array]')
            errors =  [errors];
          return next(errors);
        next(void(0))
      });
    else
      return next(
        [new Error("Missing Argument:"+method+" for the method: "+method)]
        , argvalues
      );
  }
  ref[method].apply(ref, argvalues);
}
