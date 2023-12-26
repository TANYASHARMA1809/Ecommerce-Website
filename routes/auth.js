const express=require('express');
const router=express.Router();
const User=require('../models/User');
const passport=require('passport');


//to show the form of signup
router.get('/register',(req,res)=>{
    res.render('auth/signup');
})


//actually want to register a user in DB
router.post('/register',async(req,res)=>{
    try{
        let {email,password,username,role}=req.body;
        const user=new User({email,username,role}); //password ko agrument mai use ni krnge,kuki password hash hokr jayga
        const newUser=await User.register(user,password);//password ko alg se lnge
        // res.redirect('/login');
        req.login(newUser, function(err){
            if(err){
                return next(err);
            }
            req.flash('success','welcome,you are registered successfully');
            return res.redirect('/products');
        })


    }
    catch(e){
        req.flash('error',e.message);
        return res.redirect('/signup');
    }
   
})


//to get login form
router.get('/login',(req,res)=>{
    res.render('auth/login');
})


//to actually login via the DB
router.post('/login',
passport.authenticate('local', { 
    failureRedirect: '/login', 
    failureMessage: true 
}),
(req,res)=>{
    req.flash('success','welcome back')
    res.redirect('/products');//login hone ke bd products page pr redirect hojae


});

//logout
router.get('/logout',(req,res)=>{
    ()=>{
        req.logout();
    }
    req.flash('success','goodbye friends,see you again')
    res.redirect('/login');

})





module.exports=router;
