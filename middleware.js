
// //second step for server side rendering..that is validate schema
// const Product = require('./models/Product');
// const{productSchema,reviewSchema}=require('./schema');//calling schema from schema.js


// const validateProduct=(req,res,next)=>{
//     const {name,img,price,desc}=req.body;
//     const {error} = productSchema.validate({name,img,price,desc})
//     if(error){
//         return res.render('error');
//     }
//     //if input is valid,then error is undefined
//     next();//error na aye toh next wla middleware chal jae..mtlb validate hone k baad..add or edit page pr chla jaye
// }

// const validateReview=(req,res,next)=>{
//     const {rating,comment}=req.body;
//     const {error} = reviewSchema.validate({rating,comment})
//     if(error){
//         return res.render('error');
//     }
//     next();
// }

//     //bnda logged in hai ki ya nhi uska middleware bnanege
//     const isLoggedIn = (req,res,next)=>{
//         if(!req.isAuthenticated()){
//             req.flash('error','please login first');
//             return res.redirect('/login');
//         }
//         next();
//     }

//     const isSeller=(req,res,next)=>{
//         if(!req.user.role){
//             req.flash('error','You donot have access');
//             return res.redirect('/products');
//         }
//         else if(req.user.role !== 'seller'){
//             req.flash('error','You donot have access');
//             return res.redirect('/products');
//         }
//         next();


//     }
//     const isProductAuthor=async (req,res,next)=>{
//         let {id}=req.params;//product ki id aagi
//         let product=await Product.findById(id);//entire product
//         if(!product.author.equals(req,user._id)){
//             req.flash('error','You are not the authorised user');
//             return res.redirect('/products');

//         }
//         next();

//     }


// //ab inh dono middleware ko routes ke andr use krna hai jb bhi nya product edit kre hoge
// //so will will export this
// module.exports={isProductAuthor,isSeller, isLoggedIn, validateProduct,validateReview};


// schema ko validate krne ke liye middleware.js file banayi hai..iss file ke andar dono schema ko validate krenge
// schema validate hone ke baad hi new product ko add krenge, edit krenge
const Product = require('./models/Product');
const passport = require('passport');
const {productSchema,reviewSchema,userSchema} =require('./schema');// productschema and reviewschema ko destructure krenge and schema.js file se require krenge dono schema ko


// isLoggedIn middleware ko har route m pass krenge in productRoutes
const isLoggedIn =(req,res,next)=>{  // user authenticate hai ya nhi (loggedin hai ya nhi means login hai ya nhi) y check krne ke liye middleware ka use krenge we will use isAuthenticated method y method boolean value return krta hai if it returns true  means user loggedin hai authenticate hai ...and if it returns false means loggedin nhi hai
    // req.xhr ka use krte h to check whether the request is ajax or not
    console.log("login")
    console.log(req.xhr); // true means xhr req send kr rhe hai
    if(req.xhr && !req.isAuthenticated()){
        // if(req.session.returnUrl){
        //     delete req.session.returnUrl;
        // }
        return res.status(401).json({msg:'you need to login first'});
    }
    // req.session.returnUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash('error','please login first');// if user login nhi hai toh y err show hoga and res m login bhej show hoga
        return res.redirect('/login');
    }
    next();// if user login hai toh y next() chalega means productRoutes m isLoggedIn middleware ke baad async function run hoga
};


const validateProduct=(req,res,next)=>{
    console.log("validate");
    let { name, price, desc } = req.body;
    console.log(req.body); // Log the request body
    const { error } = productSchema.validate({ name, price, desc });
    console.log(error); // Log any validation errors
    
    // schema(product ke schema) ko validate kr rhe hai...validate method return two things  err and value but hum only err ko destructure krte hai
    if(error){
        console.log("error in edit form")
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    // if validate hone ke baad err nhi aayega toh next middleware chalega
    next();// next() means err nhi aaya and product validate ho chuka hai toh ab aage badh jao means validateProduct middleware ke baad jo callback function hai(/in productRoutes.js) use run kro jo routes m pass kiya hai(/products ke routes m)
    // next is a middleware if err nhi aayega then next middleware chalega means aage ka callback fun run hoga
};

// const validateProduct = (req, res, next) => {
//     console.log("validate");
//     let { name, price, desc } = req.body;
//     const { error } = productSchema.validate({ name, price, desc });
//     console.log(error);

//     if (error) {
//         console.log("error in edit form");
//         const msg = error.details.map((err) => err.message).join(',');
//         return res.render('error', { err: msg });
//     }

//     next();
// };



const validateReview=(req,res,next)=>{
    console.log("inside validate middleware")
    console.log(req.body);
    const {rating,comment}=req.body;
    const {error} = reviewSchema.validate({rating,comment}); // review k eschema ko validate kr rhe hai
    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    // if validate hone ke baad err nhi aayega toh next middleware chalega
    next();// next() means err nhi aaya and review validate ho chuka hai toh ab aage badh jao means validateReview middleware ke baad jo callback function hai(in reviewRoutes.js file) use run kro jo routes m pass kiya hai(/products ke routes m)

}


const isSeller = (req,res,next)=>{
    console.log("enter")
    if(!req.user.role){   // if user ka koi role nhi hai then he dont have access to do anything 
        req.flash('error','You dont have the permission to do that');
        return res.redirect('/products');
    }
    else if(req.user.role !== 'seller'){ // if user ka role hai but role seller nhi hai(means buyer hai means client) then he dont have access to do anything
        req.flash('error','You dont have the permission to do that');
        return res.redirect('/products');
    }
    next();
}


// suppose 2 seller hai toh 2nd seller 1st seller ke product ko delete nhi kr sakta toh iske liye we will make isProductAuthor middleware .....iss middleware ki help se we will find product ka author kon hai
const isProductAuthor = async(req,res,next)=>{
    let {id}=req.params; // isse product ki id mil jayegi
    let product=await Product.findById(id);// Product ke database m se uss product ko find krenge with the help of id
    // when we want to compare two object ids then we have method 'equals'....hum === se two object id ko compare nhi kr sakte
    if (product && product.author && req.user && req.user._id) {
        if (!product.author.equals(req.user._id)) {
            // Your code here 
        req.flash('error','You are not a authorised user');
        return res.redirect(`/products/${id}`); 
    }
}
    next();
}

const validateUser=(req,res,next)=>{  
    const {username,password,email,role}=req.body;
    const {error} =userSchema.validate({username,password,email,role}); // user k schema ko validate kr rhe hai
    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    // if validate hone ke baad err nhi aayega toh next middleware chalega
    next();

}
module.exports={validateProduct,validateReview,isLoggedIn,isSeller,isProductAuthor,validateUser};
// validateProduct,validateReview dono middleware export kr he hai....validateProduct ko productRoutes m require krenge and validateReview ko reviewRoutes m require krnge























