const express = require('express');
const router = express.Router();
let {isLoggedIn} = require('../../middleware');
// if  ../ se folder nhi aa rha then phir se ../ krenge
const User = require('../../models/User');
//like button ke liye api create krenge
//api ka kaam hota hai to listen for the ajax request
// routes m pura page render karate hai means response m pura page bhejte hai which is not an api but in api we will send backs the data means api send backs the data
// so iss api ko app.js file m require krenge then use 
// ajax request ke liye we will copy the link from the github.com/axios and then paste in the boilerplate

router.post('/product/:productid/like' , isLoggedIn , async(req,res)=>{ // product ko like krne ke liye user login hona chahihye toh jab user like button pr click krega toh sabse pehle isLoggedIn middleware chalega
    let {productid} = req.params; // params object se product ki id mil jayegi
    console.log(productid)
    let user = req.user; // grab the current loggedin user
    let isLiked = user.wishList.includes(productid);  // we will check product pehle se liked hai ya nhi(means user ki wishlist array m iss product ki id hai ya nhi...if id hai toh product ko unlike kr denge means uss productis ko wishlist array m se remove kr dengen and if productid nhi hai toh product ko like kr denge means wishlist array m uss productid ko add kr denge)...if pehle se liked hai so it will return true and liked button pr click krenge toh unlike ho jayega .if pehle se liked nhi hai so it will return false aur like button pr click krenge toh like ho jayega
    console.log(isLiked);
    // if(isLiked){
    //     User.findByIdAndUpdate(req.user._id , {$pull:{wishList:productId}})
    // }else{
    //     User.findByIdAndUpdate(req.user._id , {$addToSet:{wishList:productId}})
    // }
    // option m operator assign hoga 
    const option = isLiked? '$pull' : '$addToSet';  // pull and add to set both are mongodb operator  (array operator)
    // pull means to remove the element from the array and addtoset means to add element in the array
    //  if product liked hai(means true) to pull operator run hoga otherwise  addToset operator run hoga(means false)
    //the below code can be done by else if as well
    req.user = await User.findByIdAndUpdate(req.user._id , {[option]:{wishList:productid}} , {new:true} ) // user ko update krenge means user ki wishlist array ko update krenge
    // [option]:{wishList:productid} => this means if option m pull operator hai to uss user ki wishlist array m se productid ko remove kr denge
    // and if option m addToset operator hai to uss user ki wishlist array m  productid ko add kr denge
    // new:true...user ko update krne ke liye
    res.send('like api');
})

// jab bhi hum apne project m koi new functionality add krte hai toh sabse pehle uss functionality ko apne schema m means model m add krte hai

module.exports = router;  // productapi ko app.js file m require krenge then use krenge

