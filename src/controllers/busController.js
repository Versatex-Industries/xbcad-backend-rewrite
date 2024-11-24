const BusRoute = require('../schemas/BusRoute');

const simulateBusMovement = async () => {
    const routes = await BusRoute.find();

    for (const route of routes) {
        const stops = route.stops.map(stop => stop.location.coordinates);
        const simulatedPoints = [];

        // Generate intermediate points between stops
        for (let i = 0; i < stops.length - 1; i++) {
            const [lng1, lat1] = stops[i];
            const [lng2, lat2] = stops[i + 1];
            const numPoints = 10; // Number of intermediate points

            for (let j = 0; j <= numPoints; j++) {
                const lat = lat1 + (lat2 - lat1) * (j / numPoints);
                const lng = lng1 + (lng2 - lng1) * (j / numPoints);
                simulatedPoints.push([lng, lat]);
            }
        }

        simulatedPoints.push(stops[0]); // Return to the starting stop to loop

        let currentIndex = 0;

        setInterval(async () => {
            if (currentIndex >= simulatedPoints.length) currentIndex = 0;

            route.liveLocation.coordinates = simulatedPoints[currentIndex];
            await route.save();

            console.log(
                `Bus on ${route.routeName} updated:`,
                route.liveLocation.coordinates
            );

            currentIndex++;
        }, 10000); // Update every 5 seconds
    }
};
simulateBusMovement();

module.exports = {
    // Get all predefined bus routes
    async getAllRoutes(req, res) {
        try {
            const routes = await BusRoute.find();
            res.status(200).json(routes);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Get details of a specific bus route
    async getRouteDetails(req, res) {
        try {
            const { routeId } = req.params;
            const route = await BusRoute.findById(routeId);
            if (!route) return res.status(404).json({ error: 'Route not found' });

            res.status(200).json(route);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Simulate live location updates for a specific route
    async getLiveLocation(req, res) {
        try {
            const { routeId } = req.params;

            // Fetch the route
            const route = await BusRoute.findById(routeId);
            if (!route) return res.status(404).json({ error: 'Route not found' });

            // Simulate live location by shifting the location coordinates in a loop
            const { liveLocation } = route;
            const newCoordinates = [
                liveLocation.coordinates[0] + 0.001, // Increment longitude for simulation
                liveLocation.coordinates[1] + 0.001  // Increment latitude for simulation
            ];

            // Update live location (only for simulation purposes)
            route.liveLocation.coordinates = newCoordinates;
            await route.save();

            res.status(200).json({ liveLocation: route.liveLocation });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }

};
