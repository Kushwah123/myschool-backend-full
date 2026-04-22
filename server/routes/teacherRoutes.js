const express = require('express');
const router = express.Router();
const { registerTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, assignSubject, getMyClasses } = require('../controllers/teacherController');
const { protect, adminOnly, teacherOnly } = require('../middlewares/authMiddleware');

// Register teacher
router.post('/register', registerTeacher);

// Teacher view assigned classes and subjects
router.get('/my-classes', protect, teacherOnly, getMyClasses);

// Assign subjects to teacher
router.post('/assign-subject', protect, adminOnly, assignSubject);

// Get all teachers
router.get('/', getAllTeachers);

// Get teacher by ID
router.get('/:id', getTeacherById);

// Update teacher (admin only)
router.put('/:id', protect, adminOnly, updateTeacher);

// Delete teacher (admin only)
router.delete('/:id', protect, adminOnly, deleteTeacher);

module.exports = router;
