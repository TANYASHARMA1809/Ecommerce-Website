// //schema for your server side validation
// //this is step 1..creating schema
// const Joi = require('joi');

// const productSchema = Joi.object({
//     name: Joi.string().required(),
//     img:Joi.string().required(),
//     price:Joi.string().min(0).required(),
//     desc:Joi.string().required()
// });

// const reviewSchema = Joi.object({
//     rating: Joi.string().min(0).max(5).required(),
//     comment:Joi.string().required()
       
// });

// module.exports={productSchema,reviewSchema};//named export and default export..this is named export




// schema for your server side validation
// copy code from joi documentation
const BaseJoi = require('joi');
// sanitize-html html tag ko remove kr deta hai ...means user input m html tag submit nhi kr sakta
const sanitizeHTML = require('sanitize-html');
// hum khud se extension create kr sakte hai  with the help of joi.dev documentation api m jakar
const extension =(joi)=>{
    return{
        type:'string',
        base:joi.string(),
        messages:{
            'string.escapeHTML': '{{#label}} must not include HTML!'
        },
        rules:{
            escapeHTML:{
                validate(value,helpers){
                    const clean = sanitizeHTML(value,{
                        allowedTags:[],
                        allowedAttributes:{},
                    });
                    if(clean !== value){
                        return helpers.error('string.escapeHTML',{value});
                    }
                    return clean;
                }
            }
        }
    }
}
// baseJOi m userdefined extension ko add kr diay hai then usse actual joi banaya hai
// extension ko extend krenge bca hume joi ko bata padta hai hum extension ke sath kaam kr rhe hai
const Joi = BaseJoi.extend(extension);
// joi ke liye schema likhenge
// product ka schema 
const productSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    price: Joi.string().min(0).required(),
    desc: Joi.string().required().escapeHTML()

});
// review ka schema
const reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    comment: Joi.string().required().escapeHTML()

});

const userSchema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .escapeHTML(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        email: Joi.string()               
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        role:Joi.string().required().escapeHTML()
});

module.exports={productSchema,reviewSchema,userSchema};