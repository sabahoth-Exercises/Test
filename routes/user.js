const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentification');

const userCtrl = require('../controller/user');
const rateLimiterToken = require("../middleware/rate_limit_token");

router.post('/signup',auth, rateLimiterToken, userCtrl.signup);
router.post('/login',auth, rateLimiterToken, userCtrl.login);

module.exports = router;