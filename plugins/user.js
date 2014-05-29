logger = require "./utils/logger"
logCategory = "APP config"
# TODO store log messages in the db
logger.configure()
mongoose = require("mongoose");


module.exports = {
  serverInit:function(req, res, next){
    User = mongoose.model("user");
    User.create(
      {groups:"admin", _active:true, email_:"admin@localhost.com", _password:"password", provider_:["local"]}, 
      function(err, user){
        if(err)
          next(err);
          logger.info(err.message, "Admin");
        else
          logger.info("An admin has been created, email: admin@localhost.com, password: password", "Admin");
      }
    );
  }
};