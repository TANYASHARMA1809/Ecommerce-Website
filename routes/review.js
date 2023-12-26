const express=require('express');
const Product = require('../models/Product');
const router=express.Router();
const Review = require('../models/Review');
const {validateReview}=require('../middleware');

router.post('/products/:id/review', validateReview, async(req,res)=>{
    try{
    let {id}=req.params;
    let {rating,comment}=req.body;
    //res.send("review route")
    const product=await Product.findById(id);//id se find kre hai..this will promise..yh ek product find kia hai
    //ab review bnaoge ..ya model se bnalo ya javascript ki class ka istemal krskte hai
    const review=new Review({rating,comment});
    product.reviews.push(review);//product ke andr reviews ke array ke andr review ka daldete hai
    await review.save();//review ko save krlnge fr
    await product.save();//then save product...DB ke andr review ko dekh pynge..db.reviews.find()..usse phle use shopping-tanya-app..usse phle mongosh..or to see collections,show collections
    req.flash('success','Review added successfully');//flash ko add kia hai yha pr..phle msg bheja tha pr locals ka use kra baad mai toh success bhejnge
    res.redirect(`/products/${id}`);//redirect krna jaruri hai 
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})

module.exports=router;
