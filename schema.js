//schema for your server side validation
//this is step 1..creating schema
const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    img:Joi.string().required(),
    price:Joi.string().min(0).required(),
    desc:Joi.string().required()
});

const reviewSchema = Joi.object({
    rating: Joi.string().min(0).max(5).required(),
    comment:Joi.string().required()
       
});

module.exports={productSchema,reviewSchema};//named export and default export..this is named export