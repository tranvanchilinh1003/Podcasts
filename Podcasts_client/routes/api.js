const express = require('express');

const shares = require('../controllers/api/shares');
const favourite = require('../controllers/api/favourite');
const cmtAPIController = require('../controllers/api/comment');
const router = express.Router();

router.get('/shares', shares.list);
router.get('/shares/detail', shares.listDetail);
router.delete('/shares/:id', shares.deleteDetail);


router.get('/favourite', favourite.list);
router.get('/favourite/detail', favourite.listDetail);
router.delete('/favourite/:id', favourite.deleteDetail);


module.exports = router;