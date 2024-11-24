const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all events
router.get('/', authMiddleware, eventController.getAllEvents);

// Get details of a specific event
router.get('/:eventId', authMiddleware, eventController.getEventDetails);

// Join an event
router.post('/join/:eventId', authMiddleware, eventController.joinEvent);

// Leave an event
router.delete('/leave/:eventId', authMiddleware, eventController.leaveEvent);

// Create a new event (teacher/admin only)
router.post('/', authMiddleware, eventController.createEvent);

module.exports = router;
