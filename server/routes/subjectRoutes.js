const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Only admin should manage subjects
router.post('/add', protect, adminOnly, subjectController.addSubject);
router.post('/', subjectController.createSubject);
router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
