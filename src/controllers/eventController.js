const Event = require('../schemas/Event');
const User = require('../schemas/User');

module.exports = {
    // Get all upcoming events
    async getAllEvents(req, res) {
        try {
            const events = await Event.find().sort({ date: 1 }); // Sort by date (earliest first)
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Get details of a specific event
    async getEventDetails(req, res) {
        try {
            const { eventId } = req.params;
            const event = await Event.findById(eventId);
            if (!event) return res.status(404).json({ error: 'Event not found' });

            res.status(200).json(event);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Join an event
    async joinEvent(req, res) {
        try {
            const { eventId } = req.params;

            // Check if the event exists
            const event = await Event.findById(eventId);
            if (!event) return res.status(404).json({ error: 'Event not found' });

            // Prevent duplicate participation
            if (event.participants.includes(req.user.id)) {
                return res.status(400).json({ error: 'You have already joined this event' });
            }

            // Add the user to the event's participants
            event.participants.push(req.user.id);
            await event.save();

            res.status(200).json({ message: 'Successfully joined the event', event });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Leave an event
    async leaveEvent(req, res) {
        try {
            const { eventId } = req.params;

            // Check if the event exists
            const event = await Event.findById(eventId);
            if (!event) return res.status(404).json({ error: 'Event not found' });

            // Remove the user from the event's participants
            event.participants = event.participants.filter((id) => id.toString() !== req.user.id);
            await event.save();

            res.status(200).json({ message: 'Successfully left the event', event });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Create a new event (Teacher/Admin only)
    async createEvent(req, res) {
        try {
            const { eventName, details, date, location } = req.body;

            // Validate role
           /* if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }*/

            // Create a new event
            const event = new Event({
                eventName,
                details,
                date,
                location,
                createdBy: req.user.id
            });
            await event.save();

            res.status(201).json({ message: 'Event created successfully', event });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }
};
