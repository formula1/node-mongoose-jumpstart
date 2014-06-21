


module.exports = {
  initializeExpressApp: function(app, next){
    app.all("/apps/three", function(req,res,next){
      res.set('Content-Type', 'text/html');
      res.render("apps/three/index.html");
    })
    next();
  }
};
