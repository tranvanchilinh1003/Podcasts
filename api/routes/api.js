const express = require('express');

const customers = require('../controllers/api/customers');
const auth = require('../controllers/api/auth');
const authToken = require('../middlewares/authToken');
const post = require('../controllers/api/post');
const comment = require('../controllers/api/comment');
const repcommentController = require('../controllers/api/repComment');
const cate = require('../controllers/api/categories');
const shares = require('../controllers/api/shares');
const favourite = require('../controllers/api/favourite');
const follow = require('../controllers/api/follow');
const router = express.Router();
// router.post('/categories_insert', cate.create);


// Router shares
router.post('/shares', shares.updateShareCount);
router.get('/shares/:id', shares.list);
router.delete('/shares/:id', shares.delete);
router.post('/favourite', favourite.updateFavouriteCount);
// Route để lấy bình luận dựa trên postId
router.get('/listcomments', comment.listcomment)
router.get('/comments', comment.list);

// Route để thêm bình luận
router.post('/comments', comment.create);

// Route để xem chi tiết bình luận theo id
router.get('/comments/:id', comment.getEdit);

// Route để sửa bình luận theo id
router.patch('/comments/:id', comment.update);

// Route để xóa bình luận theo id
router.delete('/comments/:id', comment.delete);

// Route để xóa bình luận theo id
router.delete('/comments/:id', comment.delete);

// Tạo một phản hồi mới cho bình luận
router.post('/repcomments', repcommentController.createRepComment);

// Lấy các phản hồi của một bình luận gốc
router.get('/repcomments/:commentId', repcommentController.getRepCommentsByCommentId);

// Lấy tất cả các phản hồi và các phản hồi con
router.get('/repcomments', repcommentController.getAllReplies);

// Xóa phản hồi theo ID
router.delete('/repcomments/:id', repcommentController.deleteRepComment);

// Chỉnh sửa phản hồi theo ID
router.patch('/repcomments/:id', repcommentController.editRepComment);





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

router.post('/customers', customers.create);
router.post('/customers/login', customers.login);
router.get('/customers', customers.list);
router.delete('/customers/:id', customers.delete);
router.get('/customers/:id', customers.detail);
router.patch('/customers/:id', customers.update);
router.get('/customer_search', customers.search);
router.get('/customer_keywords', customers.suggestKeywords);
router.get('/data_customers', customers.chart)


router.get('/favourite', favourite.list);
router.get('/favourite/:id', favourite.listDetail);
router.delete('/favourite/:id', favourite.deleteDetail);

router.post('/follow/:id', follow.followUser);
router.post('/unfollow/:id', follow.unfollowUser);
router.get('/check-follow/:id', follow.checkFollow);
router.get('/check-likes', follow.checkLike);
router.post('/like', follow.add);
router.delete('/like', follow.delete);
router.get('/list_follow/:id', follow.listFollow);


module.exports = router;
