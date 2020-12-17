const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { check, sanitizeBody, matchedData } = require('express-validator');
const newStudentRegistrationModel = mongoose.model('NewStudent');
var router = express.Router();

var urlEncodedParser = bodyParser.urlencoded({ extended: false });
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    if (!req.session.isAuth) {
        res.render('newregistration', {
            viewTitle: "Home Page"
        });
    }else {
        res.redirect('student/instruction');
    }
});

router.post('/', urlEncodedParser, [
    check('applicantName', 'Applicant name must be in 4 characters')
        .isLength({ min: 4 }),
    check('dob', 'Enter you birth date in dd/mm/yyyy')
        .isDate(),
    check('dob').custom((value, { req }) => {
        let d = new Date();
        let year = d.getFullYear();
        let maxYear = year - 20;
        let minYear = year - 32;
        let applicantsDOY = req.body.dob.split('-')[0];
        console.log(applicantsDOY + "  " + maxYear + "  " + minYear);
        if (applicantsDOY >= minYear && applicantsDOY <= maxYear) {
            console.log(applicantsDOY);
        } else {
            throw new Error('Applicants birth year must be between 1988 and 2000');
        }
        return true;
        //console.log(req.body.dob+"  "+cA+"   "+cB);
    }),
    check('email', 'Enter a valid email')
        .isEmail(),
    check('mobile', 'Enter a valid mobile number')
        .isLength({ min: 10 }),
    check('courses').custom((value, { req }) => {
        if (req.body.courses === '[Select]') {
            throw new Error('Select a course');
        }
        return true;
    }),
    check('password').custom((value, { req }) => {
        var lowerCaseLetters = /[a-z]/g;
        var upperCaseLetters = /[A-Z]/g;
        var numbers = /[0-9]/g;
        if (!req.body.password.match(lowerCaseLetters)) {
            throw new Error('Password must contain a lowercase letter');
        } else if (!req.body.password.match(upperCaseLetters)) {
            throw new Error('Password must contain a upper letter');
        } else if (!req.body.password.match(numbers)) {
            throw new Error('Password must contain a number');
        }
        return true;
    }),
    check('password').custom((value, { req }) => {
        if (value !== req.body.confirmpassword) {
            throw new Error('Password confirmation is incorrect');
        }

        return true;
    })

], (req, res) => {
    
    let errors = validationResult(req);
    let test = errors.array();
    let userData = req.body;
    if (!errors.isEmpty()) {
        res.render('newregistration', {
            error: test,
            userdata: userData
        });
    } else {
        newStudentRegistrationModel.findOne({ email: req.body.email }).then(user => {
            if (user) {
                res.render('newregistration',
                    {
                        unique: 'Email already exists',
                        userdata: userData
                    });
            } else {
                let student = new newStudentRegistrationModel({
                    applicantName: req.body.applicantName,
                    email: req.body.email.toLowerCase(),
                    dob: req.body.dob,
                    mobile: req.body.mobile,
                    courses: req.body.courses,
                });
                student.password = student.generateHash(req.body.password);
                student.save()
                    .then(user => {
                        res.redirect('/studentlogin');
                    });
            }
        });
    }
});


module.exports = router;