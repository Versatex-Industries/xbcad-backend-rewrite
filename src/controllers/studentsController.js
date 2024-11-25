const Grade = require('../schemas/Grade');
const Attendance = require('../schemas/Attendance');
const Timetable = require('../schemas/Timetable');
const BusRoute = require('../schemas/BusRoute');
const User = require('../schemas/User');
const Class = require('../schemas/Class');

module.exports = {
    // Get grades
    async getGrades(req, res) {
        try {
            const grades = await Grade.find({ studentId: req.user.id });
            res.status(200).json(grades);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

// Get attendance for students or parent's linked children
// Get attendance
    async getAttendance(req, res) {
        try {
            const { studentId } = req.params; // Get studentId from the request parameters

            // Validate access for parent or student
            const filter =
                req.user.role === 'Parent'
                    ? { studentId, studentId: { $in: req.user.profile.linkedChildren.map(child => child._id) } }
                    : { studentId: req.user.id };

            // Query the attendance
            const attendance = await Attendance.find(filter);
            res.status(200).json(attendance);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    async getStudentGrades(req, res) {
        try {
            const { studentId } = req.params; // Get studentId from the request parameters

            // Validate access for parent or student
            const filter =
                req.user.role === 'Parent'
                    ? { studentId, studentId: { $in: req.user.profile.linkedChildren.map(child => child._id) } }
                    : { studentId: req.user.id };

            // Query the attendance
            const grades = await Grade.find(filter);
            res.status(200).json(grades);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },


    // Get specific student profile
    async getStudentProfile(req, res) {
        try {
            const { studentId } = req.params;

            const student = await User.findById(studentId).select('-password'); // Exclude sensitive fields
            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }
            console.log(student);
            console.log(student)
            res.status(200).json(student);
        } catch (err) {
            console.error('Error fetching student profile:', err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },


    // Get timetable
    async getTimetable(req, res) {
        try {
            // Fetch student and populate classId
            const student = await User.findById(req.user.id).populate('profile.classId');
            console.log('Student:', student); // Debug student data

            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }

            if (!student.profile.classId) {
                return res.status(404).json({ error: 'Class not found for the student' });
            }

            // Fetch timetable for the student's classId
            const timetable = await Timetable.find({ classId: student.profile.classId._id });
            console.log('Timetable:', timetable); // Debug timetable data

            if (!timetable.length) {
                return res.status(404).json({ error: 'Timetable not found for the class' });
            }

            res.status(200).json(timetable);
        } catch (err) {
            console.error('Error in getTimetable:', err); // Log detailed error
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },



    async getBusRoute(req, res) {
        try {
            // Fetch the student's assigned bus route
            const student = await User.findById(req.user.id).populate('profile.busRouteId');
            if (!student || !student.profile.busRouteId) {
                return res.status(404).json({ error: 'Bus route not found for the student' });
            }

            // Fetch the detailed BusRoute data
            const busRoute = await BusRoute.findById(student.profile.busRouteId._id).select(
                'routeName stops scheduleId liveLocation'
            );
            if (!busRoute) {
                return res.status(404).json({ error: 'Bus route details not found' });
            }

            res.status(200).json(busRoute);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    async getAllClasses(req, res) {
        try {
            // Only include the `_id` and `className` fields
            const classes = await Class.find({}, { _id: 1, name: 1 });

            // Transform the result to return only id and className
            const formattedClasses = classes.map(cls => ({
                id: cls._id, // Use `id` instead of `_id` for clarity in frontend
                name: cls.name,
            }));
            res.status(200).json(formattedClasses);
        } catch (err) {
            console.error('Error fetching classes:', err.message);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }
};
