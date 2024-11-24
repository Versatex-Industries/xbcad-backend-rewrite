const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

// Middlewares
const authMiddleware = require('./middlewares/authMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const busRoutes = require('./routes/busRoutes');
const eventRoutes = require('./routes/eventRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentsRoutes = require('./routes/studentRoutes');
const teachersRoutes = require('./routes/teachersRoutes');
const timetableRoutes = require('./routes/timetableRoutes');

const app = express();

// Core middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/buses', authMiddleware, busRoutes);
app.use('/events', authMiddleware, eventRoutes);
app.use('/messages', authMiddleware, messageRoutes);
app.use('/notifications', authMiddleware, notificationRoutes);
app.use('/settings', authMiddleware, settingsRoutes);
app.use('/admin', adminRoutes);
app.use('/students', studentsRoutes);
app.use('/teachers', teachersRoutes);
app.use('/timetable', timetableRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
