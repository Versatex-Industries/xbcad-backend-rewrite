const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all conversations
router.get('/', authMiddleware, messageController.getAllConversations);

router.get('/users', authMiddleware, messageController.getAllUsers);

// Get message history with a specific user
router.get('/:contactId', authMiddleware, messageController.getMessagesWithContact);

// Send a message
router.post('/:contactId', authMiddleware, messageController.sendMessage);


module.exports = router;
