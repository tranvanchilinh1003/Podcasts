const express = require('express');

const customers = require('../controllers/api/customers');
const auth = require('../controllers/api/auth');
const authToken = require('../middlewares/authToken');

const cate = require('../controllers/api/categories');
const router = express.Router();

module.exports = router;


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
router.get('/customers', customers.list);
router.delete('/customers/:id', customers.delete);
router.get('/customers/:id', customers.detail);
router.patch('/customers/:id', customers.update);

module.exports = router;
