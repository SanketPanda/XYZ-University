const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userApplication = mongoose.model('Application_Form');
const User = mongoose.model('NewStudent');
const loginController = require('./studentLoginController');
const { check, sanitizeBody, matchedData } = require('express-validator');
const multer = require('multer');
const { compareSync } = require('bcrypt');
const path = require('path')
const fs = require('fs');
const { extname } = require('path');
var router = express.Router();


const { body, validationResult } = require('express-validator');

var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

var upload = multer({
    storage: Storage
});


router.get('/instruction', async (req, res) => {
    if (req.session.isAuth) {
        const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
        const user = await User.findOne({ email: req.session.currentUser }).exec();
        try {
            if (applicationForm != null) {
                res.render('student/instruction', {
                    userData: applicationForm,
                    user: user
                });
            } else if (applicationForm === null) {
                res.render('student/instruction', {
                    user: user
                });
            }
        } catch (e) {
            res.render('student/instruction', {
                user: user
            });
        }

    } else {
        res.redirect('/');
    }
});


router.get('/upload_photo', async (req, res) => {
    if (req.session.isAuth) {
        const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
        const user = await User.findOne({ email: req.session.currentUser }).exec();
        try {
            if (applicationForm != null) {
                res.render('student/upload_photo', {
                    userData: applicationForm,
                    user: user
                });
            } else if (applicationForm === null) {
                res.render('student/upload_photo', {
                    userData: applicationForm,
                    user: user
                });
            }

        } catch (e) {
            res.render('student/upload_photo', {
                userData: applicationForm,
                user: user
            });
        }
    } else {
        res.redirect('/');
    }
});

var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var cpUpload = upload.fields([{ name: 'profilepicture', maxCount: 1 },
{ name: 'signature', maxCount: 1 }, { name: 'tenthCertificate', maxCount: 1 },
{ name: 'twelfthCertificate', maxCount: 1 }, { name: 'graduationCertificate', maxCount: 1 },
{ name: 'migration', maxCount: 1 }, { name: 'adharCard', maxCount: 1 }])

function Checkimage(extension) {
    switch (extension) {
        case 'jpg':
            return true;
        case 'jpeg':
            return true;
        case 'png':
            return true;
        default:
            throw new Error('picture must be in .jpg or .jpeg or .png format');
    }
}


router.post('/upload_photo', cpUpload, [
    check('profilepicture').custom((value, { req }) => {
        Checkimage(req.files['profilepicture'][0].mimetype.split('/')[1].toLowerCase());
    }),
    check('signature').custom((value, { req }) => {
        Checkimage(req.files['signature'][0].mimetype.split('/')[1].toLowerCase());
    })
], async (req, res) => {
    const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
    var user = await User.findOne({ email: req.session.currentUser }).exec();
    let errors = validationResult(req);
    let test = errors.array();
    let userData = req.body;
    if (!errors.isEmpty()) {
        res.render('student/upload_photo', {
            error: test,
            userdata: userData,
            user: user
        });
    } else {
        try {
            // console.log(req.file);

            if (applicationForm != null) {
                applicationForm.profilepicture.data = req.files['profilepicture'][0].filename;
                applicationForm.profilepicture.contentType = req.files['profilepicture'][0].mimetype;
                applicationForm.signature.data = req.files['signature'][0].filename;
                applicationForm.signature.contentType = req.files['signature'][0].mimetype;
                await applicationForm.save();

                user.applicationform = applicationForm.id;
                await user.save();
                //console.log(req.files['profilepicture'][0]);
                res.render('student/upload_doc', {
                    userData: applicationForm,
                    user: user
                });
            } else if (applicationForm === null) {
                const applicationForm = new userApplication();
                applicationForm.profilepicture.data = req.files['profilepicture'][0].filename;
                applicationForm.profilepicture.contentType = req.files['profilepicture'][0].mimetype;
                applicationForm.signature.data = req.files['signature'][0].filename;
                applicationForm.signature.contentType = req.files['signature'][0].mimetype;

                var user = await User.findOne({ email: req.session.currentUser }).exec();
                applicationForm.user = user.email;
                await applicationForm.save();
                user.applicationform = applicationForm.id;
                await user.save();
                res.render('student/upload_doc', {
                    userData: applicationForm,
                    user: user
                });

            }
        } catch (e) {
            res.send(e);
        }
    }
});




router.get('/upload_doc',
    async (req, res) => {
        if (req.session.isAuth) {
            const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
            const user = await User.findOne({ email: req.session.currentUser }).exec();
            try {
                if (applicationForm != null) {
                    res.render('student/upload_doc', {
                        userData: applicationForm,
                        user: user
                    });
                } else if (applicationForm === null) {
                    res.render('student/upload_doc', {
                        userData: applicationForm,
                        user: user
                    });
                }
            } catch (e) {
                res.render('student/upload_doc', {
                    userData: applicationForm,
                    user: user
                });
            }
        } else {
            res.redirect('/');
        }
    });

router.post('/upload_doc', cpUpload, [
    check('tenthCertificate').custom((value, { req }) => {
        Checkimage(req.files['tenthCertificate'][0].mimetype.split('/')[1].toLowerCase());
    }),
    check('twelfthCertificate').custom((value, { req }) => {
        Checkimage(req.files['twelfthCertificate'][0].mimetype.split('/')[1].toLowerCase());
    }),
    check('graduationCertificate').custom((value, { req }) => {
        Checkimage(req.files['graduationCertificate'][0].mimetype.split('/')[1].toLowerCase());
    }),
    check('migration').custom((value, { req }) => {
        Checkimage(req.files['migration'][0].mimetype.split('/')[1].toLowerCase());
    }),
    check('adharCard').custom((value, { req }) => {
        Checkimage(req.files['adharCard'][0].mimetype.split('/')[1].toLowerCase());
    })
], async (req, res) => {
    const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
    var user = await User.findOne({ email: req.session.currentUser }).exec();
    let errors = validationResult(req);
    let test = errors.array();
    let userData = req.body;
    if (!errors.isEmpty()) {
        res.render('student/upload_doc', {
            error: test,
            userdata: userData,
            user: user
        });
    } else {
        try {
            if (applicationForm != null) {
                applicationForm.tenthCertificate.data = req.files['tenthCertificate'][0].filename;
                applicationForm.tenthCertificate.contentType = req.files['tenthCertificate'][0].mimetype;

                applicationForm.twelfthCertificate.data = req.files['twelfthCertificate'][0].filename;
                applicationForm.twelfthCertificate.contentType = req.files['twelfthCertificate'][0].mimetype;

                applicationForm.graduationCertificate.data = req.files['graduationCertificate'][0].filename;
                applicationForm.graduationCertificate.contentType = req.files['graduationCertificate'][0].mimetype;

                applicationForm.migration.data = req.files['migration'][0].filename;
                applicationForm.migration.contentType = req.files['migration'][0].mimetype;

                applicationForm.adharCard.data = req.files['adharCard'][0].filename;
                applicationForm.adharCard.contentType = req.files['adharCard'][0].mimetype;

                applicationForm.user = req.session.currentUser;
                await applicationForm.save();
                user.applicationform = applicationForm.id;
                await user.save();
                res.render('student/show_Print_Form', {
                    userData: applicationForm,
                    user: user
                });
            } else if (applicationForm === null) {
                const applicationForm = new userApplication();
                applicationForm.tenthCertificate.data = req.files['tenthCertificate'][0].filename;
                applicationForm.tenthCertificate.contentType = req.files['tenthCertificate'][0].mimetype;

                applicationForm.twelfthCertificate.data = req.files['twelfthCertificate'][0].filename;
                applicationForm.twelfthCertificate.contentType = req.files['twelfthCertificate'][0].mimetype;

                applicationForm.graduationCertificate.data = req.files['graduationCertificate'][0].filename;
                applicationForm.graduationCertificate.contentType = req.files['graduationCertificate'][0].mimetype;

                applicationForm.migration.data = req.files['migration'][0].filename;
                applicationForm.migration.contentType = req.files['migration'][0].mimetype;

                applicationForm.adharCard.data = req.files['adharCard'][0].filename;
                applicationForm.adharCard.contentType = req.files['adharCard'][0].mimetype;

                applicationForm.user = req.session.currentUser;
                await applicationForm.save();
                user.applicationform = applicationForm.id;
                await user.save();
                res.render('student/show_Print_Form', {
                    userData: applicationForm,
                    user: user
                });
            }

        } catch (e) {
            res.send(e);
        }
    }
});

router.get('/show_Print_Form', async (req, res) => {
    if (req.session.isAuth) {
        const applicationForm = await userApplication.findOne({ user: req.session.currentUser }).exec();
        const user = await User.findOne({ email: req.session.currentUser }).exec();
        try {

            if (applicationForm) {
                res.render('student/show_Print_Form', {
                    userData: applicationForm,
                    user: user
                });
            } else {
                res.render('student/show_Print_Form', {
                    userData: applicationForm,
                    user: user
                });
            }
        } catch (e) {
            res.render('student/show_Print_Form', {
                userData: applicationForm,
                user: user
            });
        }
    } else {
        res.redirect('/');
    }
});

router.get('/student/logout', (req, res) => {
    if (req.session.isAuth) {
        req.session.destroy((err) => {
            if (err) throw err;
            res.redirect("/studentlogin");
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
