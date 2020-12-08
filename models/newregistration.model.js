const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var newstudentregisterSchema = new mongoose.Schema({
    applicantName:{
        type:String,
        required:'This field is required'
    },
    email:{
        type:String,
        required:'This field is required'
    },
    dob:{
        type:Date,
        required:'This field is required'
    },
    mobile:{
        type:String,
        required:'This field is required'
    },
    courses:{
        type:String,
        required:'This field is required'
    },
    password:{
        type:String,
        required:'This field is required'
    }
});

newstudentregisterSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

newstudentregisterSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

mongoose.model('NewStudent',newstudentregisterSchema);