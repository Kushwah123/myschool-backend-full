const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// all marks endpoints require authentication
router.use(protect);

router.post('/add', authorize('teacher','admin'), marksController.addMarks);
router.put('/update', authorize('teacher','admin'), marksController.updateMarks);
router.post('/', authorize('teacher','admin'), marksController.addMarks);
router.put('/:id', authorize('teacher','admin'), marksController.updateMarks);
router.get('/student/:studentId', authorize('teacher','admin','student','parent'), marksController.getMarksByStudent);
router.get('/report/:studentId', authorize('teacher','admin','student','parent'), marksController.getStudentReport);
router.get('/class/:classId', authorize('teacher','admin'), marksController.getMarksByClass);
router.get('/analytics/class/:classId', authorize('teacher','admin'), marksController.getAnalyticsByClass);

module.exports = router;
