const User = require('../schemas/User');
const BusRoute = require('../schemas/BusRoute');

module.exports = {
    // Get all users
    async getAllUsers(req, res) {
        try {
            const users = await User.find().select('-password');
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Delete a user
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findByIdAndDelete(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Add a new bus route
    async addBusRoute(req, res) {
        try {
            const { routeName, stops, scheduleId } = req.body;

            const busRoute = new BusRoute({ routeName, stops, scheduleId });
            await busRoute.save();

            res.status(201).json({ message: 'Bus route added successfully', busRoute });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Delete a bus route
    async deleteBusRoute(req, res) {
        try {
            const { routeId } = req.params;

            const route = await BusRoute.findByIdAndDelete(routeId);
            if (!route) return res.status(404).json({ error: 'Bus route not found' });

            res.status(200).json({ message: 'Bus route deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }
};
