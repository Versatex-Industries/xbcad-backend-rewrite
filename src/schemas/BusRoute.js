const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
    routeName: { type: String, required: true },
    stops: [
        {
            location: {
                type: { type: String, enum: ['Point'], default: 'Point' },
                coordinates: { type: [Number], required: true }, // [longitude, latitude]
            },
            stopName: { type: String, required: true }
        }
    ],
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable' },
    liveLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    }
}, { timestamps: true, versionKey: false});

busRouteSchema.index({ 'stops.location': '2dsphere', liveLocation: '2dsphere' });

module.exports = mongoose.model('BusRoute', busRouteSchema);
