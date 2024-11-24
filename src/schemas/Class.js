const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    schedule: [{ day: String, startTime: String, endTime: String }] // Example: [{day: 'Monday', startTime: '08:00', endTime: '09:00'}]
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
