const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentification');
const stuffCtrl = require('../controller/stuff');
const multer = require("multer");
const rateLimiterIp = require('../middleware/rate_limit_IP');
const rateLimiterToken = require('../middleware/rate_limit_token');

/**
 * маршруты
 */
router.get('/', rateLimiterIp, multer, stuffCtrl.getAllStuff);
router.post('/', auth, rateLimiterToken, multer,stuffCtrl.createThing);
router.get('/:id', rateLimiterIp,multer, stuffCtrl.getOneThing);
router.put('/:id', auth, rateLimiterToken, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, rateLimiterToken, multer, stuffCtrl.deleteThing);

module.exports = router;
