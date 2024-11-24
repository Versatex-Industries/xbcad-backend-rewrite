const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all bus routes
router.get('/routes', authMiddleware, busController.getAllRoutes);

// Get a specific bus route
router.get('/routes/:routeId', authMiddleware, busController.getRouteDetails);

// Simulate live location of a bus
router.get('/location/:routeId', authMiddleware, busController.getLiveLocation);

module.exports = router;
