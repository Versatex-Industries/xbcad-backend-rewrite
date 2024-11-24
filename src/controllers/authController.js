const User = require('../schemas/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ error: 'User already exists' });

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const user = new User({ username, email, password: hashedPassword });
            await user.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                console.error('Login failed: User not found');
                return res.status(404).json({ error: 'User not found' });
            }

            console.log('Logging in user:', user);

            // Validate password
            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('Password validation result:', isValidPassword);

            if (!isValidPassword) {
                console.error('Login failed: Invalid credentials');
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
            console.log('Generated Token:', token);

            // Respond with token and role
            res.status(200).json({ token, role: user.role });
            console.log('Login response:', { token, role: user.role });
        } catch (err) {
            console.error('Server error during login:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },


    async logout(req, res) {
        // Since JWT is stateless, we can't "log out" users by invalidating tokens.
        // Add logout logic if using a token blacklist or refresh token pattern.
        res.status(200).json({ message: 'Logout successful' });
    },

    async refresh(req, res) {
        // Placeholder for JWT refresh logic
        res.status(501).json({ error: 'Not implemented yet' });
    }
};
