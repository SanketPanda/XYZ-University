const mongoose = require('mongoose');

var studentformSchema = mongoose.Schema({
    profilepicture:{
        type:String,
        required:"This field is required"
    },
    signature:{
        type:String,
        required:"This field is required"
    },
    tenthCertificate:{
        type:String
    },
    twelfthCertificate:{
        type:String
    },
    graduationCertificate:{
        type:String
    },
    migration:{
        type:String
    },
    adharCard:{
        type:String
    }
});

//mongoose.model('Application_Form',studentformSchema);