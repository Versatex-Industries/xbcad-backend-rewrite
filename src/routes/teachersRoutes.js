const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const teachersController = require('../controllers/teachersController');

// Attendance
router.post('/attendance', authMiddleware, teachersController.markAttendance);

// Grades
router.post('/grades', authMiddleware, teachersController.captureGrades);

// Timetable
router.post('/timetable', authMiddleware, teachersController.addTimetableEntry);

// Create a new class
router.post('/create-class', authMiddleware, teachersController.createClass);

// Add students to a class
router.post('/classes/:classId/students', authMiddleware, teachersController.addStudentsToClass);

// Get students from a class
router.get('/classes/:classId/students', authMiddleware, teachersController.getStudentsInClass);

// Get all classes managed by the teacher
router.get('/classes', authMiddleware, teachersController.getClasses);

router.get('/classes/students', authMiddleware, teachersController.getStudentsFromClasses);

// Get all students without a class
router.get('/students-without-class', authMiddleware, teachersController.getStudentsWithoutClass);


module.exports = router;
