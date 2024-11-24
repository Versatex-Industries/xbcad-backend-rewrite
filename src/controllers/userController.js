const User = require('../schemas/User');
const mongoose = require('mongoose');

module.exports = {
    async selectRole(req, res) {
        try {
            const { role } = req.body;

            // Ensure role is valid
            if (!['Student', 'Teacher', 'Parent'].includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }

            // Update user role
            const user = await User.findByIdAndUpdate(req.user.id, { role }, { new: true });
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json({ message: 'Role selected successfully', role: user.role });
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    },

    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json(user);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: 'Server error' });
        }
    },

    async updateProfile(req, res) {
        try {
            const { role } = req.user; // Get the user's role
            const updates = req.body;

            // Validate updates based on role
            if (role === 'Student' && updates.profile?.subject) {
                return res.status(400).json({ error: 'Students cannot have a subject field in their profile' });
            }

            if (role === 'Teacher' && updates.profile?.grade) {
                return res.status(400).json({ error: 'Teachers cannot have a grade field in their profile' });
            }

            if (role === 'Parent' && updates.profile?.grade) {
                return res.status(400).json({ error: 'Parents cannot have a grade field in their profile' });
            }

            // Update the user's profile
            const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json({ message: 'Profile updated successfully', user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },
    async patchUpdateProfile(req, res) {
        console.log(req);

        try {
            const userId = req.user.id; // Logged-in user ID
            const { profile } = req.body;

            if (!profile || typeof profile !== 'object') {
                return res.status(400).json({ error: 'Invalid profile data' });
            }

            // Convert `classId` and other ObjectId fields to ObjectId
            if (profile.classId && typeof profile.classId === 'string') {
                profile.classId = new mongoose.Types.ObjectId(profile.classId);
            }

            if (profile.busRouteId && typeof profile.busRouteId === 'string') {
                profile.busRouteId = new mongoose.Types.ObjectId(profile.busRouteId);
            }

            // Update the profile fields
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { profile } },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    async linkChild(req, res) {
        try {
            const { childId } = req.body;

            const child = await User.findById(childId);
            if (!child || child.role !== 'Student') return res.status(400).json({ error: 'Invalid child account' });

            const parent = await User.findById(req.user.id);
            parent.profile.linkedChildren.push(childId);
            await parent.save();

            res.status(200).json({ message: 'Child linked successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    },

    async getChildren(req, res) {
        try {
            const parent = await User.findById(req.user.id).populate('profile.linkedChildren', '-password');
            if (!parent) return res.status(404).json({ error: 'Parent not found' });

            res.status(200).json(parent.profile.linkedChildren);
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    }
};
