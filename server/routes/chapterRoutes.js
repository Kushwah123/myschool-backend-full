const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const { protect, adminOnly, teacherOnly } = require('../middlewares/authMiddleware');

router.post('/add', protect, adminOnly, chapterController.addChapter);
router.get('/:subjectId', protect, teacherOnly, chapterController.getChaptersBySubject);

module.exports = router;
