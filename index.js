require('./models/db');
const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyparser = require('body-parser');

const { body, validationResult } = require('express-validator');

const studentController = require('./controllers/studentController');

const homePageController = require('./controllers/homePageController');

const postgraduationController = require('./controllers/postgraduationController');

const newRegistrationController = require('./controllers/newRegistrationController');

const studentLoginController = require('./controllers/studentLoginController');

const formfillupController = require('./controllers/formfillupControler');

const app = express();

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use('/student',studentController);
app.use('/homepage',homePageController);
app.use('/postgraduation',postgraduationController);
app.use('/newregistration',newRegistrationController);
app.use('/studentlogin',studentLoginController);
app.use('/',formfillupController);
app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({
    handlebars:allowInsecurePrototypeAccess(handlebars),
    extname:'hbs',
    defaultLayout:'MainLayout',
    layoutsDir:__dirname+'/views/layouts/'
}));
app.set('view engine','hbs');
app.use(express.static(path.join(__dirname, '/public')));
app.get('/',(req,res) => {
    res.send(
        `<h2>Welcome to student database</h2>
        <h3>Click here to get access to the <b><a href="/student/list">Database</a></b></h3>
        <h3>Click here to <b><a href="/student/registration">Register</a></b></h3>
        `
    );
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
 console.log(`Server is running at port : ${PORT}`);
});