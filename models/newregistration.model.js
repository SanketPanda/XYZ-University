const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var studentformSchema = mongoose.Schema({
    profilepicture:{
        data:Buffer,
        contentType:String
    },
    signature:{
        data:Buffer,
        contentType:String
    },
    user:{
        type:Schema.Types.String,
        ref:'NewStudent',
        Image:Buffer
    },
    tenthCertificate:{
        data:Buffer,
        contentType:String
    },
    twelfthCertificate:{
        data:Buffer,
        contentType:String
    },
    graduationCertificate:{
        data:Buffer,
        contentType:String
    },
    migration:{
        data:Buffer,
        contentType:String
    },
    adharCard:{
        data:Buffer,
        contentType:String
    }
});

mongoose.model('Application_Form',studentformSchema);

var newstudentregisterSchema = new mongoose.Schema({
    applicantName:{
        type:String
    },
    email:{
        type:String
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
    },
    applicationform:{
        type:Schema.Types.ObjectId,
        ref:'Application_Form'
    } 
});

newstudentregisterSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

newstudentregisterSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

mongoose.model('NewStudent',newstudentregisterSchema);