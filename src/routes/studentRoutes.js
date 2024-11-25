const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const studentsController = require('../controllers/studentsController');

// Get grades for the logged-in student
router.get('/grades', authMiddleware, studentsController.getGrades);

router.get('/classes', authMiddleware, studentsController.getAllClasses);

// Get attendance for the logged-in student
router.get('/attendance/:studentId', authMiddleware, studentsController.getAttendance);

// Get grades for the logged-in student
router.get('/grades/:studentId', authMiddleware, studentsController.getStudentGrades);

router.get('/:studentId', authMiddleware, studentsController.getStudentProfile);

// Get timetable for the logged-in student
router.get('/timetable', authMiddleware, studentsController.getTimetable);

// Get assigned bus route for the logged-in student
router.get('/busRoute', authMiddleware, studentsController.getBusRoute);



module.exports = router;
