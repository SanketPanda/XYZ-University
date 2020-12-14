const session  = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const store = new MongoDBSession({
  uri:'mongodb://localhost:27017/StudentDB',
  session:'userSessions'
});

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      req.session.error = "You have to Login first";
      res.render("/studentlogin");
    }
  };