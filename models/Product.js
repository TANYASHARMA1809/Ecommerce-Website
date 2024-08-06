const mongoose = require('mongoose');//1. require mongoose for schema bnane ke liye
const Review=require('./Review');

//const productSchema = new mongoose.Schema({})..2. object accept krta hai

const productSchema = new mongoose.Schema({
    //4. yha pr define krnge ki product ka schema ksa najar ayega,Schema bnanege
    name:{
        type:String,
        trim:true,
        required:true
    },
    image:{
        secure_url:{
            type:String,
            trim:true
        },
        public_id:{
            type:String,
            required:true
        }
       
    } ,
    price:{
        type:Number,
        min:0,
        required:true
    },
    desc:{
        type:String,
        trim:true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'//refernce id uthati hai vo review ke model se uthani hai
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    },
    avgRating:{
        type:Number,
        default:0
    }


});


//middleware jo behind the scene mongodb operation krwane pr use hota hai and iske andr PRE and POST middleware hote hai,which are used over the schema and before the model is JS class
//pre ya post koi bhi method use krskte hai

//jb middleware i.e findOneAndDlete chlra hai..
productSchema.post('findOneAndDelete',async function(product){
    if(product.reviews.length > 0){//length greater than 0  hai tbhi toh review present hoga,tbhi dlt krpaynge
        await Review.deleteMany({_id:{$in:product.reviews}})
    }
})









let Product=mongoose.model('Product' , productSchema);//3. jab schema bnjata hai toh mongoose ka model bante hai,yh Product ka model hoga,and kiski madat se bnega, productSchema ki
module.exports = Product; //jab bhi mai 2 javascript file ke bich mai se apni chejo ko interchange krna chahta hu toh,usko exports krunga..just for resusability

