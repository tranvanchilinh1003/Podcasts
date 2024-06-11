
const express = require('express');
const router = express.Router();
const home = require('../controllers/client/home');
const form = require('../controllers/client/form');
const post = require('../controllers/client/post');
const comment = require('../controllers/client/comment'); 


const app = express();
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});
router.get('/', home.homeClient);
router.get('/about', home.getAbout);

router.get('/contact', home.getContact);
router.get('/form/login', form.login);
router.get('/form/signup', form.signup);



router.get('/form/info', form.getform);

router.get('/menu/product', home.getMenu)
router.get('/post_details', post.getPostDetail)



module.exports = router;