const mongoose=require('mongoose');
const Product=require('./models/Product');


const products=[
    {
        name:"Iphone 14pro",
        img:"https://images.unsplash.com/photo-1663499482384-f9341d990e13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGlwaG9uZTE0fGVufDB8fDB8fHww",
        price:130000,
        desc:"apple new phone,very costly"
    },
    {
        name:"Macbook m2",
        img:"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D",
        price:250000,
        desc:"smart book"
    },
    {
        name:"Airpods",
        img:"https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWlycG9kc3xlbnwwfHwwfHx8MA%3D%3D",
        price:50000,
        desc:"love in music"
    },
    {
        name:"Apple watch",
        img:"https://images.unsplash.com/photo-1602174528367-7ed9fc0737e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFwcGxlJTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D",
        price:100000,
        desc:"yes time is costly"
    },
    {
        name:"Iphone 15",
        img:"https://images.unsplash.com/photo-1695578130391-929bdfff85d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGlwaG9uZSUyMDE1fGVufDB8fDB8fHww",
        price:190000,
        desc:"Apple new Phone with new functionality"
    }

]

async function seedDB(){
    //awaitProduct.deleteMany({});

    await Product.insertMany(products);//dababase ke sth jb opertion krte hai,tb yh operation promise return krte hai,ya toh hoga ya nhi hoga,and promise ki chaing se bachne ke liye hm krte hai asyn await

    console.log("data seeded successfully");
}

module.exports = seedDB;//ssedDB is a function,usko export krlia
