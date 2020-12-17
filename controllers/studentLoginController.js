const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = mongoose.model('NewStudent');


var router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.isAuth) {
        res.render('studentlogin', {
            viewTitle: "Home Page"
        });
    } else {
        res.redirect('student/instruction');
    }
});

router.post('/', async (req, res) => {
    try {
        let userEmail = req.body.email;
        userEmail = userEmail.toLowerCase();
        var user = await User.findOne({ email: userEmail }).exec();
        if (!user) {
            res.render('studentlogin', {
                emailError: "Email is not registered"
            });
        }

        if (!user.validPassword(req.body.password)) {
            res.render("studentlogin", {
                passError: "Password is incorrect"
            });
        } else {
            req.session.isAuth = true;
            req.session.currentUser = req.body.email.toLowerCase();
            res.redirect('student/instruction');
        }

    } catch (e) {
        res.render('studentlogin');
    }
})

module.exports = router;