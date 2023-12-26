const express=require('express');//1.require express
const Product=require('../models/Product')//5.model ko require krnge kuki router.get ke andr...product ko isliye require kia kukiproduct ke andr se data ko fetch kr sake
const router=express.Router();//2.mini instance//app.get or app.post ko yha use krne ke liye..usko app se export nhi krnge
const Review=require('../models/Review');
const {validateProduct,isProductAuthor,isLoggedIn,isSeller}=require('../middleware');//jb nya product add krna ho..that is inside to actually add a product



//to show all the products

router.get('/products',isLoggedIn ,async(req,res)=>{  //3.router ka use kre hai toh usko export krna hoga
   try{

    let products=await Product.find({});//Product.find() promise return krega,isko resolve krne k liye yh tym lgaega isliye async or await ka use krnge
    res.render('products/index',{products});//products variable bnaya hai usko render krlia hai..products nam se jo bhi sara data mila hai vo index file ke andr gya hoga,index file hai products ke andr
   }
   catch(e){
    res.status(500).render('error',{err:e.message});// e ke andr message bhi aata hia,usko print kra lnge..status dikhnge phle fr render krnger error pr
   }
})

//to show form for new product
router.get('/product/new',isLoggedIn,(req,res)=>{
    try{
    res.render('products/new');
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})


//to actually add a product
router.post('/products',validateProduct,isLoggedIn,isSeller, async(req,res)=>{
    try{
    let {name,img,price,desc}=req.body;
    await Product.create({name,img,price,desc,author:req.user._id});//mongoose model which create product which return promise so async and await
    req.flash('success','Product added successfully');
    res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})

//to show a particular product
router.get('/products/:id',isLoggedIn,async(req,res)=>{
    try{
    let {id} = req.params; //id milegi request ke params mai se
    let foundProduct=await Product.findById(id).populate('reviews'); //databse ke andr deknge ab
    res.render('products/show',{foundProduct , msg:req.flash('msg')}) //show krnge ab ese render krke
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})


//form to edit the product
router.get('/products/:id/edit',isLoggedIn, async(req,res)=>{
    let {id}=req.params;
    let foundProduct=await Product.findById(id);
    res.render('products/edit',{foundProduct})
})

//to actually added/edit data in DB
router.patch('/products/:id',validateProduct,isLoggedIn,async(req,res)=>{
    try{
    let {id}=req.params;
    let {name,img,price,desc} =req.body;
    await Product.findByIdAndUpdate(id , {name,img,price,desc});
    req.flash('success','Product edited successfully');//flash added
    res.redirect(`/products/${id}`);   // id ko evaluate krna hoga isliye mai yha pr back tick ka istemal krunga
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})


//to delete a product
router.delete('/products/:id',isLoggedIn,isProductAuthor, async(req,res)=>{
    try{
    let {id} =req.params;
    const product= await Product.findById(id);//phle product ko find krlia

    //1st way to delete the product..but  rather than doing this we do through middleware
    // for(let id of product.reviews){   //ek ek krke product ke review ko dlt krnge 
    //     await Review.findByIdAndDelete(id); //product ke reviews ke array ke andr sirf uski id hai,jispr ap populate kro id ki madat se,data laa paye or data delete krpae
    // }
    await Product.findByIdAndDelete(id);
    req.flash('success','Product deleted successfully');
    res.redirect('/products')
    }
    catch(e){
        res.status(500).render('error',{err:e.message});//err is key..usse error.ejs se catch krnge
    }
})

module.exports=router;//4.export kradia router