const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = mongoose.model('NewStudent');

var router = express.Router();


router.get('/instruction', (req, res) => {
    res.render('instruction', {
        viewTitle: "Home Page"
    });
});


router.get('/upload_photo', (req, res) => {
    res.render('upload_photo', {
        viewTitle: "Home Page"
    });
});

router.get('/upload_doc', (req, res) => {
    res.render('upload_doc', {
        viewTitle: "Home Page"
    });
});

router.get('/show_Print_Form', (req, res) => {
    res.render('show_Print_Form', {
        viewTitle: "Home Page"
    });
});

module.exports = router;
