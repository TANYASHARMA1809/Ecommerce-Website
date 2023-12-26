const mongoose = require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

//PLM directly added username and password
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        required:true
    },
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    wishList:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
});
//plugin schema pr lgega
userSchema.plugin(passportLocalMongoose);// this plugin is responsible for all the properties which PLM provides us..it is before model and schema ke badd lgaynge

let User=mongoose.model('User' , userSchema);
module.exports = User; 