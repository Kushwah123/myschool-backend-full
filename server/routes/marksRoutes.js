const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');

router.post('/', marksController.addMarks);
router.put('/:id', marksController.updateMarks);
router.get('/student/:studentId', marksController.getMarksByStudent);
router.get('/class/:classId', marksController.getMarksByClass);

module.exports = router;
