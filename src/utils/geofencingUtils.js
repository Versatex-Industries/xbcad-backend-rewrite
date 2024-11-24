const geolib = require('geolib');

// Check if the current location is within a defined geofence
const isWithinGeofence = (currentLocation, geofenceCenter, radiusInMeters) => {
    return geolib.isPointWithinRadius(
        { latitude: currentLocation.lat, longitude: currentLocation.lng },
        { latitude: geofenceCenter.lat, longitude: geofenceCenter.lng },
        radiusInMeters
    );
};

module.exports = { isWithinGeofence };
