const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = mongoose.model('NewStudent');

var router = express.Router();


router.get('/', (req, res) => {
    res.render('studentlogin', {
        viewTitle: "Home Page"
    });
});

router.post('/', async (req,res) => {
   try {
    let userEmail = req.body.email;
    userEmail = userEmail.toLowerCase();
    var user = await User.findOne({email:userEmail}).exec();
    if(!user) {
        res.render('studentlogin',{
            emailError:"Email is not registered"
        });
    }

    if(!user.validPassword(req.body.password)){
        res.render("studentlogin",{
            passError:"Password is incorrect"
        });
    } else{
    res.redirect('/instruction');
    }

   } catch(e) {
       console.log(e);
   }
})

module.exports = router;