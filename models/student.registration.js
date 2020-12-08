const mongoose = require('mongoose');

var studentRegistrationSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:'This field is required'
    },
    lastName:{
        type:String,
        required:'This field is required'
    },
    email:{
        type:String,
        required:'This field is required'
    },
    mobile:{
        type:Number,
        required:'This field is required'
    },
    gender:{
        type:String,
        required:'This field is required'
    },
    city:{
        type:String,
        required:'This field is required'
    },
    image:{ 
        type: String, 
        required:'This field is required'
    } ,
    password:{
        type:String,
        required:'This field is required'
    }
}); 

mongoose.model('StudentRegistration',studentRegistrationSchema);