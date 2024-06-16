
const express = require('express');
const router = express.Router();
const home = require('../controllers/client/home');
const form = require('../controllers/client/form');
const post = require('../controllers/client/post');
// const form_login = require('../controllers/client/login');
// const form_signup = require('../controllers/client/signup');
// const form_info = require('../controllers/client/info');

// const Cart = require('../controllers/client/cart');
const app = express();
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});
router.get('/', home.homeClient);
router.get('/about', home.getAbout);
router.get('/contact', home.getContact);
// //login
// //login_form
router.get('/logout', home.logout)

router.get('/form/login', form.login);
router.post('/form/loginUser', form.loginUser);
// //signup
router.get('/form/signup', form.signup);
router.post('/form/insertUser' , form.createUser);


// //info
router.get('/form/info', form.getform);

router.get('/search', form.getsearch);
// router.post('/update/:id', form_info.update);
// // products
router.get('/menu/product/:id', home.getMenu)
router.get('/menu/product-all', home.getPostAll)
router.get('/menu/post_details/:id', post.getPostDetail)

router.post('/comments', post.addComment);
// router.get('/products_cate/:id', Products.getProductCate)

// // cart
// router.get('/cart', Cart.getCart)
// router.get('/checkout' , Cart.getCheckout);
// router.post('/add-to-cart', Cart.addCart);
// router.get('/delete-cart/:id', Cart.deleteCart);
// router.get('/cleart', Cart.clearall)



module.exports = router;