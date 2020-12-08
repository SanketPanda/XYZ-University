const express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('homePage', {
        viewTitle: "Home Page"
    });
});

module.exports = router;