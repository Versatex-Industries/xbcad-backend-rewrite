const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new Error('Invalid token');
    }
};

module.exports = { generateToken, verifyToken };
