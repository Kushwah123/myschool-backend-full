const express = require('express');
const router = express.Router();
const {
  addHomeworkAndSend,
  fetchHomeworkByClass,
  fetchHomeworkByStudent,
  getTeacherHomework,
  getAllHomework,
  getHomeworkDetails,
  updateHomework,
  deleteHomework,
  resendFailedMessages
} = require('../controllers/homeworkController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// ✅ Teacher Routes (Protected)
router.post('/', protect, authorize('teacher'), addHomeworkAndSend); // Create and send homework
router.get('/my-homework', protect, authorize('teacher'), getTeacherHomework); // Get teacher's homework
router.put('/:homeworkId', protect, authorize('teacher'), updateHomework); // Edit homework (unsent only)
router.delete('/:homeworkId', protect, authorize('teacher'), deleteHomework); // Delete homework (unsent only)
router.post('/:homeworkId/resend-failed', protect, authorize('teacher'), resendFailedMessages); // Resend failed

// ✅ Admin Routes (Protected)
router.get('/admin/all', protect, authorize('admin'), getAllHomework); // Get all homework with filters
router.get('/admin/:homeworkId', protect, authorize('admin'), getHomeworkDetails); // Get homework details with recipients

// ✅ Public Routes (Protected - Any authenticated user)
router.get('/class/:classId', protect, fetchHomeworkByClass); // Fetch by class
router.get('/student/:studentId', protect, fetchHomeworkByStudent); // Fetch by student
router.get('/:homeworkId', protect, getHomeworkDetails); // Get homework details

module.exports = router;
