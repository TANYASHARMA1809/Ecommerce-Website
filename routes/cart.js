const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middleware');//jb nya product add krna ho..that is inside to actually add a product
const Product = require('../models/Product');
const User = require('../models/User');



//route to see the cart
router.get('/user/cart',isLoggedIn,async(req,res)=>{
   try {
    let user=await User.findById(req.user._id).populate('cart');
    // res.render('cart/cart' , {user})
     const totalAmount = user.cart.reduce((sum , curr)=> sum+curr.price , 0)
     const productInfo = user.cart.map((p)=>p.desc).join(',');
     res.render('cart/cart' , {user, totalAmount , productInfo });
   } catch (e) {
    res.status(500).render('error',{err:e.message});
   }

})



//actually adding the product to the cart

router.post('/user/:productId/add',isLoggedIn,async(req,res)=>{
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