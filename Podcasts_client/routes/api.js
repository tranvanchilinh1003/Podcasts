const express = require('express');

const customers = require('../controllers/api/customers');
const auth = require('../controllers/api/auth');
const authToken = require('../middlewares/authToken');
const post = require('../controllers/api/post');
const comment = require('../controllers/api/comment');
const cate = require('../controllers/api/categories');
const shares = require('../controllers/api/shares');
const favourite = require('../controllers/api/favourite');
const router = express.Router();
// router.post('/categories_insert', cate.create);
router.get('/post', post.list);
router.post('/post', post.create);
router.get('/post/:id', post.edit);
router.delete('/post/:id', post.delete);
router.patch('/post/:id', post.update);



// router.post('/categories_insert', cate.create);
router.get('/shares', shares.list);
router.get('/shares/:id', shares.listDetail);
router.delete('/shares/:id', shares.deleteDetail);
// router.delete('/categories_delete/:id', cate.delete);
// router.get('/categories_edit/:id', cate.edit);
// router.patch('/categories_update/:id', cate.update);
router.get('/comment', comment.list);
router.get('/comment/:id', comment.edit);
router.delete('/comment/:id', comment.delete);



router.post('/login', auth.login )
router.post('/logout', auth.logout )
router.post('/forgotPassword', auth.forgotPassword)
router.post('/otp', auth.otp);
router.patch('/changepassword', auth.changePassword)


router.post('/categories', cate.create);
router.get('/categories', cate.list);
router.delete('/categories/:id', cate.delete);
router.get('/categories/:id', cate.detail);
router.patch('/categories/:id', cate.update);

router.post('/customers', customers.create);
router.post('/customers/login', customers.login);
router.get('/customers', customers.list);
router.delete('/customers/:id', customers.delete);
router.get('/customers/:id', customers.detail);
router.patch('/customers/:id', customers.update);

router.get('/favourite', favourite.list);
router.get('/favourite/:id', favourite.listDetail);
router.delete('/favourite/:id', favourite.deleteDetail);



module.exports = router;
