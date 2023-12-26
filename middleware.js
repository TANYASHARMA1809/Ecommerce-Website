
//second step for server side rendering..that is validate schema
const Product = require('./models/Product');
const{productSchema,reviewSchema}=require('./schema');//calling schema from schema.js


const validateProduct=(req,res,next)=>{
    const {name,img,price,desc}=req.body;
    const {error} = productSchema.validate({name,img,price,desc})
    if(error){
        return res.render('error');
    }
    //if input is valid,then error is undefined
    next();//error na aye toh next wla middleware chal jae..mtlb validate hone k baad..add or edit page pr chla jaye
}

const validateReview=(req,res,next)=>{
    const {rating,comment}=req.body;
    const {error} = reviewSchema.validate({rating,comment})
    if(error){
        return res.render('error');
    }
    next();
}

    //bnda logged in hai ki ya nhi uska middleware bnanege
    const isLoggedIn = (req,res,next)=>{
        if(!req.isAuthenticated()){
            req.flash('error','please login first');
            return res.redirect('/login');
        }
        next();
    }

    const isSeller=(req,res,next)=>{
        if(!req.user.role){
            req.flash('error','You donot have access');
            return res.redirect('/products');
        }
        else if(req.user.role !== 'seller'){
            req.flash('error','You donot have access');
            return res.redirect('/products');
        }
        next();


    }
    const isProductAuthor=async (req,res,next)=>{
        let {id}=req.params;//product ki id aagi
        let product=await Product.findById(id);//entire product
        if(!product.author.equals(req,user._id)){
            req.flash('error','You are not the authorised user');
            return res.redirect('/products');

        }
        next();

    }


//ab inh dono middleware ko routes ke andr use krna hai jb bhi nya product edit kre hoge
//so will will export this
module.exports={isProductAuthor,isSeller, isLoggedIn, validateProduct,validateReview};


























