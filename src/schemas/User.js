const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Student', 'Teacher', 'Parent']},
    profile: {
        name: { type: String },
        surname: { type: String },
        grade: { type: String }, // Student-specific
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // Student-specific
        busRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute' }, // Student-specific
        subject: { type: String }, // Teacher-specific
        linkedChildren: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Parent-specific
    },
    deviceTokens: [{ type: String }], // For push notifications
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
