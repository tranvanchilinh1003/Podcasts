const express = require('express');

const shares = require('../controllers/api/shares');
const favourite = require('../controllers/api/favourite');

const router = express.Router();

// router.post('/categories_insert', cate.create);
router.get('/shares', shares.list);
router.get('/shares/detail', shares.listDetail);
router.delete('/shares/:id', shares.deleteDetail);
// router.delete('/categories_delete/:id', cate.delete);
// router.get('/categories_edit/:id', cate.edit);
// router.patch('/categories_update/:id', cate.update);

router.get('/favourite', favourite.list);
router.get('/favourite/detail', favourite.listDetail);
router.delete('/favourite/:id', favourite.deleteDetail);



module.exports = router;