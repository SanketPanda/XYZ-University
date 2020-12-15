require('./models/db');
const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const bodyparser = require('body-parser');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const { body, validationResult } = require('express-validator');

const isAuth = require("./controllers/is-auth");

//const studentController = require('./controllers/studentController');

const homePageController = require('./controllers/homePageController');

const postgraduationController = require('./controllers/postgraduationController');

const newRegistrationController = require('./controllers/newRegistrationController');

const studentLoginController = require('./controllers/studentLoginController');

const formfillupController = require('./controllers/formfillupControler');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const store = new MongoDBSession({
    uri: 'mongodb://localhost:27017/StudentDB',
    session: 'userSessions'
});

app.use(session({
    secret: 'login secret key',
    resave: false,
    saveUninitialized: false,
    store: store,
}))

///app.use('/student',studentController);

app.use('/postgraduation', postgraduationController);
app.use('/newregistration', newRegistrationController);
app.use('/studentlogin', studentLoginController);
app.use('/student', formfillupController);

app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    extname: 'hbs',
    defaultLayout: 'MainLayout',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');
//app.use('/', homePageController);
app.get('/', (req, res) => {
    res.render('homePage', {
        viewTitle: "Home Page"
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log(`Server is running at port : ${PORT}`);
});