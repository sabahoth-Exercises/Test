const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentification');
const stuffCtrl = require('../controller/stuff');
const multer = require("multer");

/**
 * маршруты
 */
router.get('/', multer, stuffCtrl.getAllStuff);
router.post('/', auth, multer,stuffCtrl.createThing);
router.get('/:id',multer, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, multer, stuffCtrl.deleteThing);

module.exports = router;
