const Message = require('../schemas/Message');
const User = require('../schemas/User');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


module.exports = {
    // Get all conversations for the logged-in user
    async getAllConversations(req, res) {
        try {
            const currentUserId = req.user.id;

            // Aggregate messages
            const conversations = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { senderId: new ObjectId(currentUserId) },
                            { recipientId: new ObjectId(currentUserId) }
                        ]
                    }
                },
                {
                    $project: {
                        otherUser: {
                            $cond: [
                                { $eq: ['$senderId', new ObjectId(currentUserId)] },
                                '$recipientId',
                                '$senderId'
                            ]
                        },
                        content: 1,
                        createdAt: 1
                    }
                },
                {
                    $group: {
                        _id: '$otherUser',
                        lastMessage: { $last: '$content' },
                        lastMessageTime: { $last: '$createdAt' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'contactDetails'
                    }
                },
                {
                    $project: {
                        contactId: '$_id',
                        contactName: { $arrayElemAt: ['$contactDetails.username', 0] },
                        lastMessage: 1,
                        lastMessageTime: 1
                    }
                }
            ]);

            res.status(200).json(conversations);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },



    // Get message history with a specific contact
    async getMessagesWithContact(req, res) {
        try {
            const userId = req.user.id;
            const { contactId } = req.params;

            // Fetch all messages between the logged-in user and the contact
            const messages = await Message.find({
                $or: [
                    { senderId: userId, recipientId: contactId },
                    { senderId: contactId, recipientId: userId }
                ]
            }).sort({ timestamp: 1 }); // Sort by oldest first for conversation history

            res.status(200).json(messages);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Send a message to a specific contact
    async sendMessage(req, res) {
        try {
            const senderId = req.user.id;
            const { contactId } = req.params;
            const { content } = req.body;

            // Validate recipient
            const recipient = await User.findById(contactId);
            if (!recipient) return res.status(404).json({ error: 'Recipient not found' });

            // Create a new message
            const userMessage = new Message({
                senderId,
                recipientId: contactId,
                content,
                timestamp: new Date()
            });
            await userMessage.save();

            res.status(201).json({ message: 'Message sent successfully', userMessage });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            // Exclude sensitive fields like password
            const users = await User.find({}, { password: 0, deviceTokens: 0, __v: 0 });

            // Ensure there are users to return
            if (!users || users.length === 0) {
                return res.status(404).json({ error: 'No users found' });
            }

            // Return user data
            res.status(200).json(users);
        } catch (err) {
            console.error('Error fetching users:', err.message);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }
};
