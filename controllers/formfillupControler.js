const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userApplication = mongoose.model('Application_Form');
const User = mongoose.model('NewStudent');
const loginController = require('./studentLoginController');
const auth = require('./is-auth');
const multer = require('multer');
const { compareSync } = require('bcrypt');
const path = require('path');
const e = require('express');
var router = express.Router();

var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

var upload = multer({
    storage: Storage
});

router.get('/instruction', (req, res) => {
    if (req.session.isAuth) {
        res.render('student/instruction', {
            viewTitle: "Home Page"
        });
    } else {
        res.redirect('/homePage');
    }
});


router.get('/upload_photo', async (req, res) => {
    if (req.session.isAuth) {
        try {
            const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
            if (applicationForm != null) {
                res.render('student/upload_photo', {
                    userData: applicationForm
                });
            }
        } catch (e) {
            res.render('student/upload_photo');
        }
    } else {
        res.redirect('/homePage');
    }
});

var cpUpload = upload.fields([{ name: 'profilepicture', maxCount: 1 },
{ name: 'signature', maxCount: 1 }, { name: 'tenthCertificate', maxCount: 1 },
{ name: 'twelfthCertificate', maxCount: 1 }, { name: 'graduationCertificate', maxCount: 1 },
{ name: 'migration', maxCount: 1 }, { name: 'adharCard', maxCount: 1 }])

router.post('/upload_photo', cpUpload, async (req, res) => {
    try {
        const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
        if (applicationForm != null) {
            applicationForm.profilepicture = req.files['profilepicture'][0].filename;
            applicationForm.signature = req.files['signature'][0].filename;
            await applicationForm.save();
            var user = await User.findOne({ email: applicationForm.user }).exec();
            user.applicationform = applicationForm.id;
            await user.save();
            res.render('student/upload_doc', {
                userData: applicationForm
            });
        } else if (applicationForm === null) {
            const applicationForm = new userApplication({
                profilepicture: req.files['profilepicture'][0].filename,
                signature: req.files['signature'][0].filename,
            });
            applicationForm.user = user.email;
            await applicationForm.save();
            var user = await User.findOne({ email: currentUser }).exec();
            user.applicationform = applicationForm.id;
            await user.save();
            res.render('student/upload_doc', {
                userData: applicationForm
            });
        }
    } catch (e) {
        res.send(e);
    }
});


router.get('/upload_doc', async (req, res) => {
    if (req.session.isAuth) {
        try {
            const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
            if (applicationForm) {
                res.render('student/upload_doc', {
                    userData: applicationForm
                });
            }
        } catch (e) {
            res.render('student/upload_doc');
        }
    } else {
        res.redirect('/homePage');
    }
});

router.post('/upload_doc', cpUpload, async (req, res) => {
    try {
        const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
        if (applicationForm != null) {
            applicationForm.tenthCertificate = req.files['tenthCertificate'][0].filename;
            applicationForm.twelfthCertificate = req.files['twelfthCertificate'][0].filename;
            applicationForm.graduationCertificate = req.files['graduationCertificate'][0].filename;
            applicationForm.migration = req.files['migration'][0].filename;
            applicationForm.adharCard = req.files['adharCard'][0].filename;
            applicationForm.user = req.session.currentUser;
            await applicationForm.save();
            var user = await User.findOne({ email: req.session.currentUser }).exec();
            user.applicationform = applicationForm.id;
            await user.save();
            res.render('student/show_Print_Form', {
                userData: applicationForm
            });
        } else if (applicationForm === null) {
            const applicationForm = new userApplication({
                tenthCertificate: req.files['tenthCertificate'][0].filename,
                twelfthCertificate: req.files['twelfthCertificate'][0].filename,
                graduationCertificate: req.files['graduationCertificate'][0].filename,
                migration: req.files['migration'][0].filename,
                adharCard: req.files['adharCard'][0].filename
            });
            applicationForm.user = req.session.currentUser;
            await applicationForm.save();
            var user = await User.findOne({ email: req.session.currentUser }).exec();
            user.applicationform = applicationForm.id;
            await user.save();
            res.render('student/show_Print_Form', {
                userData: applicationForm
            });
        }

    } catch (e) {
        res.send(e);
    }
});

router.get('/show_Print_Form', async (req, res) => {
    if (req.session.isAuth) {
        try {
            const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
            if (applicationForm) {
                res.render('student/show_Print_Form', {
                    userData: applicationForm
                });
            }
        } catch (e) {
            res.render('student/show_Print_Form');
        }
    } else {
        res.redirect('/homePage');
    }
});

router.get('/student/logout', (req, res) => {
    if (req.session.isAuth) {
        req.session.destroy((err) => {
            if (err) throw err;
            res.redirect("/studentlogin");
        });
    } else {
        res.redirect('/homePage');
    }
});

module.exports = router;
