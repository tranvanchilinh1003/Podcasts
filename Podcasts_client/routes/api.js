const express = require('express');

const customers = require('../controllers/api/customers');
const auth = require('../controllers/api/auth');
const authToken = require('../middlewares/authToken');
const router = express.Router();

// router.post('/categories_insert', cate.create);
router.get('/customers', customers.list);
router.delete('/customers/:id', customers.delete);
// router.get('/categories_edit/:id', cate.edit);
// router.patch('/categories_update/:id', cate.update);



router.post('/login', auth.login )
router.post('/logout', auth.logout )
module.exports = router;