const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const User = require('../models/User');
const Product = require('../models/Product');

router.get('/user/myorders',isLoggedIn,async(req, res) => {
    
    const userid = req.user._id;

    const user = await User.findById(userid).populate({
        path: 'orders',
        populate: {
            path: 'orderedProducts'
        }
    });

    res.render('orders/order',{orders:user.orders});
});

module.exports = router;