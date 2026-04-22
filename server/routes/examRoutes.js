const express = require('express');
const router = express.Router();
const { protect, authorize, teacherOnly, adminOnly } = require('../middlewares/authMiddleware');
const examController = require('../controllers/examController');

router.use(protect);
router.post('/', authorize('teacher','admin'), examController.createExam);
router.get('/class/:classId', examController.getExamsByClass);
router.get('/subject/:subjectId', examController.getExamsBySubject);
router.put('/:id', authorize('teacher','admin'), examController.updateExam);
router.delete('/:id', authorize('teacher','admin'), examController.deleteExam);

module.exports = router;
