// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const path = require('path');
// const multer = require('multer');
// var upload = multer({ dest: 'uploads/' });
// const bcrypt = require('bcrypt');
// const { check, sanitizeBody, matchedData } = require('express-validator');
// const Student = mongoose.model('Student');
// const RegisterStudent = mongoose.model('StudentRegistration');
// var router = express.Router();


// var jsonParser = bodyParser.json();
// var urlEncodedParser = bodyParser.urlencoded({ extended: false });

// const { body, validationResult } = require('express-validator');

// mongoose.set('useFindAndModify', false);

// router.get('/registration', (req, res) => {
//     res.render('student/registration', {
//         viewTitle: "Student Registration"
//     });
// });

// router.post('/registration', urlEncodedParser, [
//     check('firstName', 'firstname must be in 3 characters')
//         .isLength({ min: 3 }),
//     check('lastName', 'lastName must be in 3 characters')
//         .isLength({ min: 3 }),
//     check('email', 'Enter a valid email')
//         .isEmail(),
//     check('email').custom((value, { req }) => {
//         if (value !== req.body.confirmEmail) {
//             throw new Error('Email confirmation is incorrect');
//         }

//         return true;
//     }),
//     check('mobile', 'Enter a valid mobile number')
//         .isLength({ min: 10 }),
//     check('picture').custom((value, { req }) => {
//         var extension = (path.extname(value)).toLowerCase();
//         switch (extension) {
//             case '.jpg':
//                 return true;
//             case '.jpeg':
//                 return true;
//             case '.png':
//                 return true;
//             default:
//                 throw new Error('picture must be in .jpg or .jpeg or .png format');
//         }
//     }),
//     check('password', 'Password must be 6 characters')
//         .isLength({ min: 6 }),
//     check('password').custom((value, { req }) => {
//         var lowerCaseLetters = /[a-z]/g;
//         var upperCaseLetters = /[A-Z]/g;
//         var numbers = /[0-9]/g;
//         if (!req.body.password.match(lowerCaseLetters)) {
//             throw new Error('Password must contain a lowercase letter');
//         } else if (!req.body.password.match(upperCaseLetters)) {
//             throw new Error('Password must contain a upper letter');
//         } else if (!req.body.password.match(numbers)) {
//             throw new Error('Password must contain a number');
//         }
//         return true;
//     }),
//     check('password').custom((value, { req }) => {
//         if (value !== req.body.confirmPassword) {
//             throw new Error('Password confirmation is incorrect');
//         }

//         return true;
//     })
// ], upload.single('picture')
//     , (req, res) => {
//         let errors = validationResult(req);
//         let test = errors.array();
//         let userData = req.body;
//         if (!errors.isEmpty()) {
//             res.render('student/registration', {
//                 viewTitle: "Student Registration",
//                 error: test,
//                 userdata: userData

//             });
//         } else {
//             RegisterStudent.findOne({ email: req.body.email }).then(user => {
//                 if (user) {
//                     res.render('student/registration',
//                         {
//                             viewTitle: 'Student Registration',
//                             unique: 'Email already exists',
//                             userdata: userData
//                         });
//                 } else {
//                     let student = new RegisterStudent({
//                         firstName: req.body.firstName,
//                         lastName: req.body.lastName,
//                         email: req.body.email,
//                         mobile: req.body.mobile,
//                         gender: req.body.gender,
//                         city: req.body.city,
//                         image: req.body.picture,
//                         password: req.body.password
//                     });
//                     student.save()
//                         .then(user => {
//                             res.render('student/list');
//                         })
//                 }
//             });
//         }
//     });



// router.get('/', (req, res) => {
//     res.render('student/addOrEdit', {
//         viewTitle: 'Insert Student'
//     });
// });

// router.post('/', (req, res) => {
//     if (req.body._id == '') {
//         InsertRecord(req, res);
//     } else {
//         UpdateRecord(req, res);
//     }
// });

// function InsertRecord(req, res) {
//     var student = new Student;
//     student.fullName = req.body.fullName;
//     student.email = req.body.email;
//     student.mobile = req.body.mobile;
//     student.city = req.body.city;
//     student.save((err, doc) => {
//         if (!err) {
//             res.redirect('student/list');
//         } else {
//             console.log("Error during insert", err);
//         }
//     });
// }

// function UpdateRecord(req, res) {
//     Student.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
//         if (!err) {
//             res.redirect('/student/list');
//         } else {
//             console.log("Error during update", err);
//         }
//     });
// }

// router.get('/list', (req, res) => {
//     Student.find((err, doc) => {
//         if (!err) {
//             res.render('student/list', {
//                 list: doc,
//             })
//         } else {
//             console.log("Error in retrival", err);
//         }
//     })
// });

// router.get('/:id', (req, res) => {
//     Student.findById(req.params.id, (err, doc) => {
//         if (!err) {
//             res.render('student/addOrEdit', {
//                 viewTitle: "Update Student",
//                 student: doc
//             });
//             console.log(doc);
//         }
//     });
// });

// router.get('/delete/:id', (req, res) => {
//     Student.findByIdAndRemove(req.params.id, (err, doc) => {
//         if (!err) {
//             Student.find((err, doc) => {
//                 if (!err) {
//                     res.render('student/list', {
//                         list: doc,
//                     })
//                 } else {
//                     console.log("Error in retrival", err);
//                 }
//             });
//         }
//         else {
//             console.log("Error in deletion" + err);
//         }
//     });
// });



// module.exports = router;