const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Restrict all admin routes to Admin role
const adminOnly = [authMiddleware, roleMiddleware(['Admin'])];

// Get all users
router.get('/users', adminOnly, adminController.getAllUsers);

// Delete a user
router.delete('/users/:userId', adminOnly, adminController.deleteUser);

// Add a new bus route
router.post('/buses', adminOnly, adminController.addBusRoute);

// Delete a bus route
router.delete('/buses/:routeId', adminOnly, adminController.deleteBusRoute);

module.exports = router;
