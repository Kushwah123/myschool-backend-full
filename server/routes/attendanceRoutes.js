const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.markAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.get('/student/:studentId', attendanceController.getAttendanceByStudent);
router.get('/class/:classId/date/:date', attendanceController.getAttendanceByClassAndDate);

module.exports = router;
