const express=require('express');
const router=express.Router();//mini instance
const {isLoggedIn}=require('../middleware');
const User=require('../models/User');
const Product=require('../models/Product');
// route to see the cart
// jab user /user/cart pr req krega toh res m cart page show hoga and cart.ejs page pr currentuser ka data bhej rhe hai(data means wo user and uski cart bhej rhe hai)
router.get('/user/cart',isLoggedIn,async(req,res)=>{
    try{
        let user=await User.findById(req.user._id).populate('cart'); // jab bhi mongodb ke sath means database ke sath kaam krte hai so we will use populate method.....User ke database m se user ko find krenge with the help of id and user variable m uss user ke cart bhi aa jayenge(means uss user ne apne cart m konse products add kiye hai)
        const totalAmount = user.cart.reduce((sum , curr)=> sum+curr.price , 0); // reduce is a array method(reduce mdn documentation) which accepts two parameters here 0 means initiallty sum is 0
        // curr is iterator jo cart ke har item(means product) pr iterate krega
        // totalAmount m sum aa jayega means cart m jitne bhi items hai sab ka sum
        const productInfo = user.cart.map((product)=>product.desc).join(',');
        console.log(productInfo);
        res.render('cart/cart',{user,totalAmount,productInfo});  
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
    
})
// actually adding the product to the cart
// ja user add to cart button pr click krega toh y route hit hoga
// jab user product ko cart m add krega means add to cart button pr click krega toh user ke cart m wo product add ho jayega...user ke cart m product ki id aa jayegi(means cart array m uss product ki id store ho jayegi)
// User ke database m changes kr rhe hai mneans user ke cart m product ko add kr he hai...user ki cart array m product ki id ko store kr rhe hai that's why post req jayegi
router.post('/user/:productId/add',isLoggedIn,async(req,res)=>{
    try{
        let {productId}=req.params;
    let userId =req.user._id;
    let product = await Product.findById(productId);
    let user = await User.findById(userId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart');
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }    
})
//  to delete the product form the cart
router.delete('/user/:productId',isLoggedIn,async(req,res)=>{
    try{
        let {productId} = req.params;
        let userId = req.user._id;
        let user = await User.findById(userId);
        // let product = await Product.findById(productId);
        // User ke database m se uss user ko find krenge with the help of id then user ki cart m se uss productid means uss product ko delte kr denge
        await User.findByIdAndUpdate(userId,{['$pull']:{cart:productId}}, {new:true});
        res.redirect('/user/cart');
    }
    catch(e)
    {
        res.status(500).render('error',{err:e.message});
    }
})
module.exports=router;
// cart user ki hoti hai(buyer ki hoti hai)..add to cart means user product ko cart m add kr lega
// cart ke andar product ki ids store hongi
