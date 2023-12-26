const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middleware');//jb nya product add krna ho..that is inside to actually add a product
const Product = require('../models/Product');
const User = require('../models/User');



//route to see the cart
router.get('/user/cart',isLoggedIn,async(req,res)=>{
    let user=await User.findById(req.user._id).populate('cart');
   // res.render('cart/cart' , {user})
    const totalAmount = user.cart.reduce((sum , curr)=> sum+curr.price , 0)
    const productInfo = user.cart.map((p)=>p.desc).join(',');
    res.render('cart/cart' , {user, totalAmount , productInfo });

})



//actually adding the product to the cart
router.post('/user/:productId/add',isLoggedIn,async(req,res)=>{
    let {productId}=req.params;//product ki id milri h
    let userId=req.user._id;//user ki id milri h
    let product=await Product.findById(productId);
    let user=await User.findById(userId);
    user.cart.push(product);
    user.save();
    res.redirect('/user/cart');




})
















module.exports=router;