const jwt = require('jsonwebtoken');
const User = require('../schemas/User');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Authorization Header:', req.headers.authorization);
        console.log('Extracted Token:', token);

        if (!token) return res.status(401).json({ error: 'Unauthorized: Token missing' });

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            console.error('User not found for ID:', decoded.id);
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        console.log('Authenticated User:', user);

        // Attach user info to the request object
        req.user = user;
        next();
    } catch (err) {
        console.error('Authentication Error:', err);
        res.status(401).json({ error: 'Unauthorized: Invalid token', details: err.message });
    }
};
