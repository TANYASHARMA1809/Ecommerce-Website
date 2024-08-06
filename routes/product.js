const express=require('express');//1.require express
const Product=require('../models/Product')//5.model ko require krnge kuki router.get ke andr...product ko isliye require kia kukiproduct ke andr se data ko fetch kr sake
const router=express.Router();//2.mini instance//app.get or app.post ko yha use krne ke liye..usko app se export nhi krnge
const Review=require('../models/Review');
const {validateProduct,isProductAuthor,isLoggedIn,isSeller}=require('../middleware');//jb nya product add krna ho..that is inside to actually add a product
const {uploadImageOnCloudinary,deleteImageFromCloudinary} = require('../cloudinaryConfig');
const upload = require('../multer');

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
router.post('/products',isLoggedIn,upload.single('image'), isSeller, validateProduct, async(req,res)=>{
    // try{
    // let {name,img,price,desc}=req.body;
    // await Product.create({name,img,price,desc,author:req.user._id});//mongoose model which create product which return promise so async and await
    // req.flash('success','Product added successfully');
    // res.redirect('/products');
    // }
    // catch(e){
    //     res.status(500).render('error',{err:e.message});
    // }
    try{
        console.log("create")

        console.log("File received:", req.file);
         // Check if file was uploaded successfully
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        // Upload image to Cloudinary
        const uploadResult = await uploadImageOnCloudinary(req.file.path, 'products');
        console.log("Cloudinary upload result:", uploadResult);
    //   const file = {
    //       image: uploadResult.secure_url
    //   };

    // Extract necessary data from Cloudinary response
        const { secure_url, public_id } = uploadResult;
            // jab form submit hoga toh sara data req ki body m milega ....toh unn sabhi data ko object ke andar destructure krenge....(object ke andar vahi name likhte h jo humne schema m define kiya h)
            const {name,price,desc}=req.body;  // body object ke data ko dekhne ke liye we will use the middleware app.use(express.urlencoded)
          
            // database ke andar new product ko add krenge...means Product model ke andar new product create krenge and req.user object ke andar currentuser ki sari information hoti hai jo abhi login hua hai toh req.user._id se currentuser ki id(objectid) author m assign kr denge means jo user abhi loggedin hua hai uski id author m assign kr denge...toh jab hum ek new product banayenge toh usme author ki id bhi store hogi
           const newProduct =  await Product.create({
            name,price,desc,author:req.user._id,
                image:{
                    secure_url,
                    public_id
                }
                }); // create method ko call krne ke

                if (!newProduct) {
                    console.error('Error while creating product in the database');
                    return res.status(400).json({ msg: 'Error while creating product in the database' });
                }

                console.log('Product added successfully:', newProduct);
                // return res.status(200).json({ msg: 'new product addedd' });
            //  create mongodb ka method hai and y promise return krta hai to promise ki chaining se bachne ke liye we will use async and await
            // author can be buyer or seller (login krne ke baad navabr pr uss buyer ya seller ka name show hoga jisne bhi login kiya hai)
            // database ke andar new product add hone ke baad /products page pr redirect krenge
            req.flash('success','Product added successfully');
            console.log("redirect to products page")
            res.redirect('/products')// redirect means get req jayegi /products pr and sabhi products show ho jayenge with new product
    }
    catch(e){
        // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
        console.error(e);
    return res.status(500).json({ msg: 'Something went wrong', error: e.message });
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
router.patch('/products/:id',isLoggedIn,upload.single('image'), isProductAuthor, validateProduct,async(req,res)=>{
    // try{
    // let {id}=req.params;
    // let {name,img,price,desc} =req.body;
    // await Product.findByIdAndUpdate(id , {name,img,price,desc});
    // req.flash('success','Product edited successfully');//flash added
    // res.redirect(`/products/${id}`);   // id ko evaluate krna hoga isliye mai yha pr back tick ka istemal krunga
    // }
    // catch(e){
    //     res.status(500).render('error',{err:e.message});
    // }
    try {
        console.log("updateProduct");
        const { id } = req.params;
        const { name, price, desc } = req.body;
        console.log(req.body);

        // Find the existing product
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if a new file is uploaded
        if (req.file) {
            // Delete the old image from Cloudinary
            if (product.image.public_id) {
                await deleteImageFromCloudinary(product.image.public_id);
            }

            // Upload new image to Cloudinary
            const uploadResult = await uploadImageOnCloudinary(req.file.path, 'products');
            product.image.secure_url = uploadResult.secure_url;
            product.image.public_id = uploadResult.public_id;
        } else {
            // If no new image is uploaded, retain the existing image details
            product.image.secure_url = product.image.secure_url;
            product.image.public_id = product.image.public_id;
        }

        // Update product details
        product.name = name;
        product.price = price;
        product.desc = desc;

        // Save the updated product
        const updatedProduct = await product.save();
        if (!updatedProduct) {
            return res.status(400).json({ msg: 'Error while updating product in the database' });
        }

        req.flash('success', 'Product edited successfully');
        res.redirect(`/products/${id}`); // Redirect to the edited product page
    } catch (e) {
        console.error(e);
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