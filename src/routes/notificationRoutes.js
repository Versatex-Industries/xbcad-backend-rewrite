const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const Notification = require('../schemas/Notification');


// Get all notifications
router.get('/', authMiddleware, notificationController.getAllNotifications);

// Send a new notification (Admin/Teacher only)
router.post('/', authMiddleware, notificationController.sendNotification);

// Update notification preferences
router.patch('/preferences', authMiddleware, notificationController.updatePreferences);

// Mark notification as read
router.patch('/:notificationId', authMiddleware, async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { read } = req.body;

        if (read === undefined) {
            return res.status(400).json({ error: "Missing 'read' field in request body" });
        }

        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { read },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({
            message: 'Notification marked as read',
            notification: updatedNotification,
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});


module.exports = router;
