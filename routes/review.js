const express=require('express');
const Product = require('../models/Product');
const router=express.Router();
const Review = require('../models/Review');
const {validateReview,isLoggedIn, isProductAuthor}=require('../middleware');

router.post('/products/:id/review', validateReview,isLoggedIn, async(req,res)=>{
    try{
    let {id}=req.params;
    let {rating,comment}=req.body;
    //res.send("review route")
    const product=await Product.findById(id);//id se find kre hai..this will promise..yh ek product find kia hai
    //ab review bnaoge ..ya model se bnalo ya javascript ki class ka istemal krskte hai
    const review=new Review({rating,comment});

    // average rating logic
    const newAverageRating =((product.avgRating*product.reviews.length) + parseInt(rating)) / (product.reviews.length+1);
    product.avgRating = parseFloat(newAverageRating.toFixed(1));
    
    product.reviews.push(review);//product ke andr reviews ke array ke andr review ka daldete hai
    await review.save();//review ko save krlnge fr
    await product.save();//then save product...DB ke andr review ko dekh pynge..db.reviews.find()..usse phle use shopping-tanya-app..usse phle mongosh..or to see collections,show collections
    req.flash('success','Review added successfully!!');//flash ko add kia hai yha pr..phle msg bheja tha pr locals ka use kra baad mai toh success bhejnge
    res.redirect(`/products/${id}`);//redirect krna jaruri hai 
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})

router.delete('/products/:productId/reviews/:reviewId',isLoggedIn,isProductAuthor,async (req,res)=>{
    try{
        let {productId} = req.params;
        
        // review ko delete krme ke liye sabse pehle uss product ko find krenge jiske review ko delte krna hai findById se
        let product = await Product.findById(productId);
        let {reviewId} =req.params;
         await Review.findByIdAndDelete(reviewId);
         await Product.findByIdAndUpdate(productId,{['$pull']:{reviews:reviewId}}, {new:true});
        //  Product ke database m se uss product ko find krenge jiske review ko delete krna hai then uss product ke reviews array m se uss reviewId ko delete kr denge
         // pull means to remove the element from the array .. it is a mongodb array operator
         req.flash('success','Reviews deleted Successfully');
         res.redirect(`/products/${productId}`);
    }
    catch(e){
        // console.log('error')
        res.status(500).render('error',{err:e.message});
    }
})

module.exports=router;
