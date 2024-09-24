console.log("connected");
const allLikeButton = document.querySelectorAll('.like-btn');
// jab like button pr click krenge toh click event perform hoga and we will send the ajax request to the server so like button ke liye api create krenge in productapi.js file in routes folder
//like button ke liye api create krenge
//api ka kaam hota hai to listen for the ajax request
// routes m pura page render karate hai means response m pura page bhejte hai which is not an api but in api we will send backs the data means api send backs the data
// so iss api ko app.js file m require krenge then use 
// ajax request ke liye we will use axios(because axios help to make ajax request) so we will copy the link from the github.com/axios and then paste in the boilerplate

async function likeButton(productId , btn){
    try{
        let response = await axios({
            method: 'post',
            url: `/product/${productId}/like`,
            headers: {'X-Requested-With': 'XMLHttpRequest'}, // headers ka use krte hai to send the extra information means hum header m y bata rhe hai we are sending xhr request
        });
        console.log(response);
        //status is 200 means successfull request
        console.log(btn.children[0]);
        //  if else m jo conditions likhi hai these are client side rendering
        if(btn.children[0].classList.contains('fas')){
            btn.children[0].classList.remove('fas')
            btn.children[0].classList.add('far')
        } else{
            btn.children[0].classList.remove('far')
            btn.children[0].classList.add('fas')
        }
        // console.log(response);
    }
    catch (e) {
        // console.log(e);
        // used to redirect the browser using js
        window.location.replace('/login'); //redirect
        // console.log(e.message)
    }
}


for(let btn of allLikeButton){
    btn.addEventListener('click' , ()=>{
        // console.log(btn.getAttribute('product-id'));
        let productId = btn.getAttribute('product-id'); // isse uss product ki id aa jayegi jis product ko user ne like kiya hai
        console.log(productId)
        likeButton(productId,btn);
    })
}