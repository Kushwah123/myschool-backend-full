const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { protect, authorize, adminOnly, teacherOnly } = require('../middlewares/authMiddleware');

router.post('/', protect, teacherOnly, complaintController.createComplaint);
router.get('/', protect, adminOnly, complaintController.getAllComplaints);
router.get('/student/:studentId', protect, adminOnly, complaintController.getComplaintsByStudent);
router.get('/teacher/:teacherId', protect, authorize('admin', 'teacher'), complaintController.getComplaintsByTeacher);
router.get('/:id', protect, authorize('admin', 'teacher'), complaintController.getComplaintById);

module.exports = router;
