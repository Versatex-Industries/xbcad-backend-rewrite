const express = require('express');
const router = express.Router();
const teachersController = require('../controllers/teachersController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:classId', authMiddleware, teachersController.getTimetableForClass);

module.exports = router;
