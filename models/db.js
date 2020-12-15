const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Sanket_Panda:Sanket1234@cluster0.71exn.mongodb.net/StudentDB?retryWrites=true&w=majority', {
    useNewUrlParser:true
},
err => {
    if(!err) {
        console.log('Connection successded');
    } else {
        console.log('Error in connection', err);
    }
})

require('./student.model');
require('./student.registration');
require('./newregistration.model');
require('./studentform.model');