const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        min:0,
        max:5

    },
    comment:{
        type:String,
        trim:true 

    }
   
},{timestamps:true}); //timestamp is used to add time of current,updated or created add dono ka access deta hai
let Review=mongoose.model('Review' , reviewSchema);
module.exports = Review; 