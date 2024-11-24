const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Update language preference
router.put('/language', authMiddleware, settingsController.updateLanguage);

// Update profile settings
router.put('/profile', authMiddleware, settingsController.updateProfileSettings);

// Update notification settings
router.put('/notifications', authMiddleware, settingsController.updateNotificationSettings);

// Get help and support content
router.get('/help', authMiddleware, settingsController.getHelpContent);

module.exports = router;
