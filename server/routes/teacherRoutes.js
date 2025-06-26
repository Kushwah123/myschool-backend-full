const express = require('express');
const router = express.Router();
const { registerTeacher, getAllTeachers } = require('../controllers/teacherController');
const { protect } = require('../middlewares/authMiddleware');

// Register teacher
router.post('/register',  registerTeacher);

// Get all teachers
router.get('/',  getAllTeachers);

module.exports = router;
