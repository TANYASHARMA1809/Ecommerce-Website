
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:__dirname+"/.env"});
}
const express=require('express');
const app=express();//express ko require kia
const path=require('path');
const mongoose = require('mongoose');
const seedDB=require('./seed');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User = require('./models/User');

const productRoutes =require('./routes/product');
const reviewRoutes=require('./routes/review');
const authRoutes=require('./routes/auth');
const cartRoutes=require('./routes/cart');


const db_url=process.env.db_url
mongoose.connect(db_url)//yeh connect promise return krta hai
.then(()=>{
    console.log("DB connected successfully")
})
.catch((err)=>{
    console.log("DB error");
    console.log(err)
})

//session
let configSession={
    secret:'keyboard cat',
    resave:false,
    saveUnintialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+ 24*7*60*60*1000,
        maxAge:24*7*60*60*1000
    }
}


app.engine('ejs',ejsMate);//yha pr engine connect kre hai
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));//views folder //join directory name with views ka folder
app.use(express.static(path.join(__dirname,'public')));//public folder
app.use(express.urlencoded({extended:true}));//undefined error aara tha,isliye yh middleware lgaya hai
app.use(methodOverride('_method'));//method override ko use kia hai simply
//express-session as middleware
app.use(session(configSession));
//flash middleware use kre h
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());//taki locally store krpao
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//storing things inside locals object
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();//sara kam shi chlra hoga toh agle middleware pr chle jana
})

//Passport
passport.use(new LocalStrategy(User.authenticate()));



//seeding database:kitni br chlaunga
//seedDB()

app.use(productRoutes);//so that harr incoming request ke liye path check kia jae
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);







app.listen(8080,()=>{
    console.log("server connected at port 8080")
})