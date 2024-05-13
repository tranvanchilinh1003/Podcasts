
const express = require('express');
const router = express.Router();
const home = require('../controllers/client/home');
// const form_login = require('../controllers/client/login');
// const form_signup = require('../controllers/client/signup');
// const form_info = require('../controllers/client/info');
// const Products = require('../controllers/client/products');
// const Cart = require('../controllers/client/cart');
const app = express();
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});
router.get('/', home.homeClient);
// router.get('/about', home.getAbout);
// router.get('/blog', home.getBlog);
// router.get('/contact', home.getContact);
// //login
// router.get('/form/login', form_login.login);
// //signup
// router.get('/form/signup', form_signup.signup);
// router.post('/form/sigup' , form_signup.sigup_user);
// //login_form
// router.get('/logout', home.logout)

// //info
// router.get('/form/info/:id', form_info.getform);

// router.get('/search', form_info.getsearch);
// router.post('/update/:id', form_info.update);
// // products
// router.get('/products', Products.getMenu)
// router.get('/products_details/:id', Products.getProductDetails)
// router.post('/comments_sp', Products.addComment);
// router.get('/products_cate/:id', Products.getProductCate)

// // cart
// router.get('/cart', Cart.getCart)
// router.get('/checkout' , Cart.getCheckout);
// router.post('/add-to-cart', Cart.addCart);
// router.get('/delete-cart/:id', Cart.deleteCart);
// router.get('/cleart', Cart.clearall)



module.exports = router;