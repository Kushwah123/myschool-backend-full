const express = require('express');
const router = express.Router();
const { createClass, getAllClasses, assignClassTeacher } = require('../controllers/classController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Create new class
router.post('/', createClass);

// Assign class teacher
router.put('/assign-teacher', protect, adminOnly, assignClassTeacher);

// Get all classes
router.get('/', getAllClasses);

module.exports = router;
