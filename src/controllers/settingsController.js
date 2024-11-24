const User = require('../schemas/User');

module.exports = {
    // Update language preference
    async updateLanguage(req, res) {
        try {
            const { language } = req.body;

            // Validate the language (for now, only English, Afrikaans and Zulu are allowed)
            const allowedLanguages = ['en', 'af', 'zu'];
            if (!allowedLanguages.includes(language)) {
                return res.status(400).json({ error: 'Invalid language preference' });
            }

            // Update the user's language preference
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { 'profile.language': language },
                { new: true }
            ).select('-password');

            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json({ message: 'Language preference updated', language });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Update profile settings
    async updateProfileSettings(req, res) {
        try {
            const updates = req.body;

            // Update the user's profile settings
            const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json({ message: 'Profile settings updated', user });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Update notification preferences
    async updateNotificationSettings(req, res) {
        try {
            const { preferences } = req.body;

            // Validate preferences
            if (typeof preferences !== 'object' || !Object.keys(preferences).length) {
                return res.status(400).json({ error: 'Invalid preferences' });
            }

            // Update the user's notification settings
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { 'profile.notificationPreferences': preferences },
                { new: true }
            ).select('-password');

            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json({ message: 'Notification settings updated', preferences });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Get help and support content
    async getHelpContent(req, res) {
        try {
            // Simulate static help content
            const helpContent = {
                faq: [
                    { question: 'How do I reset my password?', answer: 'Go to the login page and click "Forgot Password".' },
                    { question: 'How can I contact support?', answer: 'Email us at support@example.com.' }
                ],
                contact: {
                    email: 'support@example.com',
                    phone: '+27 123 456 789'
                }
            };

            res.status(200).json(helpContent);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }
};
