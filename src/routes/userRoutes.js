const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Select role after registration
router.post('/select-role', authMiddleware, userController.selectRole);

// Get user profile
router.get('/profile', authMiddleware, userController.getProfile);


// Update user profile
router.put('/profile', authMiddleware, userController.updateProfile);

// Patch user profile
router.patch('/profile', authMiddleware, userController.patchUpdateProfile);

// Link a child to a parent
router.post('/children', authMiddleware, userController.linkChild);

// Get children linked to a parent
router.get('/children', authMiddleware, userController.getChildren);

module.exports = router;
