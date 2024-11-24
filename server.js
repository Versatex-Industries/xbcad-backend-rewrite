const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config');

const PORT = config.port;

// Connect to the database and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to the database:', err);
});
