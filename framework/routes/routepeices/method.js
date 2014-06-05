
function getArgs(func){
  fnStr = func.toString()
  fnStr = fnStr.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
  result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')'))\
  .match(/([^\s,]+)/g)
  if(result == null)
    result = []
  return result
}

module.exports = function(req,res,next){
  if(typeof req.mvc.instance == "undefined")
    ref = req.mvc.model;
  else if(req.mvc.subpath)
    ref = req.mvc.instance[req.mvc.subpath];
  else
    ref = req.mvc.instance;
  method =  req.mvc.method;
  query = req.mvc.args;
  var argsnames = utils.getArgs(ref[method]);
  var argvalues = [];
  for name in argsnames
    if(query[name])
      argvalues.push query[name]
    else if(name.match(/req|request|res|response|next|cb|callback/))
      continue
    else
      return next(
        [new Error("Missing Argument:"+method+" for the method: "+method)]
        , argvalues
      );
  if(argsnames[1].match(/res|response/))
    argvalues.unshift(res);
  if(argsnames[0].match(/req|request/))
    argvalues.unshift(req);
  if(argsnames[argsnames.length-1].match(/next|cb|callback/))
    argvalues.push(function(errors){
      if(errors)
        if(Object.prototype.toString.call( errors ) != '[object Array]')
          errors =  [errors];
        return next(errors);
      next(void(0))
    });
  ref[method].apply(ref, argvalues);
}
