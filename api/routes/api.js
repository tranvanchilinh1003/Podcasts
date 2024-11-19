const express = require('express');

const customers = require('../controllers/api/customers');
const auth = require('../controllers/api/auth');
const authToken = require('../middlewares/authToken');
const post = require('../controllers/api/post');
const cate = require('../controllers/api/categories');
const shares = require('../controllers/api/shares');
const favourite = require('../controllers/api/favourite');
const follow = require('../controllers/api/follow');
const notification = require('../controllers/api/notification');
const background = require('../controllers/api/background');
const router = express.Router();
// router.post('/categories_insert', cate.create);


// Router shares
router.post('/shares', shares.updateShareCount);
router.get('/shares/:id', shares.list);
router.delete('/shares/:id', shares.delete);
router.post('/favourite', favourite.updateFavouriteCount);


router.post('/login', auth.login )
router.post('/logout', auth.logout )
router.post('/forgotPassword', auth.forgotPassword)
router.post('/otp', auth.otp);
router.patch('/changepassword', auth.changePassword)
router.post('/check_email', auth.checkmail)


router.post('/post', post.create);
router.get('/post', post.list);
router.delete('/post/:id', post.delete);
router.get('/post/:id', post.edit);
router.get('/getId_post/:id', post.getPost);
router.get('/get_All', post.getAllPost);
router.patch('/post/:id', post.update);
router.get('/post_search', post.search);
router.get('/suggest_keywords', post.suggestKeywords);
router.get('/data', post.data);
router.get('/data_post', post.chart)
router.get('/post_home_client', post.getHome)
router.post('/update_view/:id', post.view)
router.get('/post-customer/:id', post.customerId)




router.post('/categories', cate.create);
router.get('/categories', cate.list);
router.get('/categories_All', cate.listall);
router.delete('/categories/:id', cate.delete);
router.get('/categories/:id', cate.detail);
router.get('/product/:id', cate.getId);
router.patch('/categories/:id', cate.update);
router.patch('/categoryOrder', cate.order);




router.post('/customers', customers.create);
router.post('/customers/login', customers.login);
router.get('/customers', customers.list);
router.delete('/customers/:id', customers.delete);
router.get('/customers/:id', customers.detail);
router.patch('/customers/:id', customers.update);
router.get('/customer_search', customers.search);
router.get('/customer_keywords', customers.suggestKeywords);
router.get('/data_customers', customers.chart)
router.get('/customers/noti/:id', customers.getUserInfo);

router.patch('/background/:id',background.update )



router.get('/favourite', favourite.list);
router.get('/favourite/:id', favourite.listDetail);
router.delete('/favourite/:id', favourite.deleteDetail);

router.post('/follow/:id', follow.followUser);
router.get('/follow', follow.topFollow);
router.post('/unfollow/:id', follow.unfollowUser);
router.get('/check-follow/:id', follow.checkFollow);
router.get('/check-likes', follow.checkLike);
router.post('/like', follow.add);
router.delete('/like', follow.delete);
router.get('/list_followed/:id', follow.listFollowed);
router.get('/list_follower/:id', follow.listFollower);



router.post('/notification', notification.Createnotification)
router.delete('/notification/:id', notification.delete)
router.get('/notification_userId/:id', notification.getList)
router.patch('/notification/:id', notification.update)
router.post('/notify', notification.notify)

module.exports = router;
