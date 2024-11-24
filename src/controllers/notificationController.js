const Notification = require('../schemas/Notification');
const User = require('../schemas/User');

module.exports = {
    // Get all notifications for the logged-in user
    async getAllNotifications(req, res) {
        try {
            const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }); // Most recent first
            res.status(200).json(notifications);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Update notification preferences
    async updatePreferences(req, res) {
        try {
            const { preferences } = req.body; // Example: { timetable: true, grades: false }

            // Validate preferences
            if (typeof preferences !== 'object' || !Object.keys(preferences).length) {
                return res.status(400).json({ error: 'Invalid preferences' });
            }

            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            // Update preferences in the user profile
            user.profile.notificationPreferences = preferences;
            await user.save();

            res.status(200).json({ message: 'Notification preferences updated', preferences });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

// Send a new global notification
    async sendNotification(req, res) {
        try {
            const { type, content } = req.body;

            // Validate input
            if (!type || !content) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Fetch all users (add a filter if needed for roles)
            const users = await User.find({}); // Add { role: 'Student' } if it's only for students

            // Create notifications for all users
            const notifications = users.map(user => ({
                userId: user._id,
                type,
                content
            }));
            await Notification.insertMany(notifications);

            res.status(201).json({ message: 'Global notification sent successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }

};
