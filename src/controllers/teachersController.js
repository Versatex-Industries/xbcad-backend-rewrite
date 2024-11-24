const Attendance = require('../schemas/Attendance');
const Grade = require('../schemas/Grade');
const Timetable = require('../schemas/Timetable');
const User = require('../schemas/User');
const Class = require('../schemas/Class');

module.exports = {
    // Mark Attendance
    async markAttendance(req, res) {
        try {
            if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }

            const { studentId, date, status, remarks, classId } = req.body;

            if (!studentId || !date || !status || !classId) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const attendance = new Attendance({
                studentId,
                date,
                status,
                remarks,
                classId,
                teacherId: req.user.id,
            });

            await attendance.save();
            res.status(201).json({ message: 'Attendance marked successfully', attendance });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Capture Grades
    async captureGrades(req, res) {
        try {
            if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }

            const { studentId, subject, grade, remarks } = req.body;

            if (!studentId || !subject || !grade) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const newGrade = new Grade({
                studentId,
                subject,
                grade,
                remarks,
                teacherId: req.user.id,
            });

            await newGrade.save();
            res.status(201).json({ message: 'Grade captured successfully', grade: newGrade });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },



    // Create a new class
    async createClass(req, res) {
        try {
           /* if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }*/

            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Class name is required' });
            }

            const newClass = await Class.create({
                name,
                teacherId: req.user.id,
                students: []
            });

            res.status(201).json({ message: 'Class created successfully', classId: newClass._id });
        } catch (err) {
            console.error('Error creating class:', err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Get all students in a specific class
    async getStudentsInClass(req, res) {
        try {
            if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }

            const { classId } = req.params;

            if (!classId) {
                return res.status(400).json({ error: 'Class ID is required' });
            }

            // Find the class and populate the student list
            const classObj = await Class.findById(classId).populate('students', 'username email profile.name profile.surname');
            if (!classObj) {
                return res.status(404).json({ error: 'Class not found' });
            }

            res.status(200).json(classObj.students);
        } catch (err) {
            console.error('Error fetching students for class:', err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },


    // Add students to a class
    async addStudentsToClass(req, res) {
        try {
            if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }

            const { classId } = req.params;
            const { studentIds } = req.body; // Expecting an array of student IDs

            if (!studentIds || !Array.isArray(studentIds)) {
                return res.status(400).json({ error: 'Invalid student IDs' });
            }

            const classObj = await Class.findById(classId);
            if (!classObj) {
                return res.status(404).json({ error: 'Class not found' });
            }

            // Update the students array in the class
            classObj.students = [...new Set([...classObj.students, ...studentIds])];
            await classObj.save();

            // Update the students' profile with the classId
            await User.updateMany(
                { _id: { $in: studentIds } },
                { $set: { 'profile.classId': classId } }
            );

            res.status(200).json({ message: 'Students added to the class', class: classObj });
        } catch (err) {
            console.error('Error adding students to class:', err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Get all classes managed by the teacher
        async getClasses(req, res) {
        try {
            if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }

            const classes = await Class.find({ teacherId: req.user.id })
                .populate('students', '_id') // Only include student IDs
                .select('name students');
            res.status(200).json(classes);

        } catch (err) {
            console.error('Error fetching classes:', err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Get all students from teacher's classes (without duplicates)
    async getStudentsFromClasses(req, res) {
        try {
            if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }

            const classes = await Class.find({ teacherId: req.user.id }).populate('students', 'profile.name profile.surname _id');

            const studentMap = new Map(); // To avoid duplicates
            classes.forEach(classObj => {
                classObj.students.forEach(student => {
                    studentMap.set(student._id.toString(), student); // Use student ID as the key
                });
            });

            const uniqueStudents = Array.from(studentMap.values()); // Get unique students
            res.status(200).json(uniqueStudents);
        } catch (err) {
            console.error('Error fetching students from classes:', err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },


    // Get students without a class
    async getStudentsWithoutClass(req, res) {
        try {
            /*if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }*/

            const studentsWithoutClass = await User.find({ role: 'Student', 'profile.classId': { $exists: false } })
                .select('-password')
                .lean();

            res.status(200).json(studentsWithoutClass);
        } catch (err) {
            console.error('Error fetching students without a class:', err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },

    // Add a timetable entry
    async addTimetableEntry(req, res) {
        try {
            if (req.user.role !== 'Teacher') {
                return res.status(403).json({ error: 'Permission denied' });
            }

            const { classId, day, period, subject } = req.body;

            if (!classId || !day || !period || !subject) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const timetableEntry = new Timetable({
                classId,
                day,
                period,
                subject,
                teacherId: req.user.id,
            });

            await timetableEntry.save();
            res.status(201).json({ message: 'Timetable entry added successfully', entry: timetableEntry });
        } catch (err) {
            console.error('Error adding timetable entry:', err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    },
// Controller Method
    async getTimetableForClass(req, res) {
        try {
            const { classId } = req.params;


            const timetable = await Timetable.find({ classId })
                .populate('teacherId', 'profile.name profile.surname') // Assuming teacher info is stored in the `profile` field.
                .exec();

            const formattedTimetable = timetable.map(entry => ({
                day: entry.day,
                period: entry.period,
                subject: entry.subject,
                teacherName: `${entry.teacherId?.profile?.name || ''} ${entry.teacherId?.profile?.surname || ''}`.trim()
            }));

            res.status(200).json(formattedTimetable);
        } catch (err) {
            console.error('Error fetching timetable:', err);
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }


};
