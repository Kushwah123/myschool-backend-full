const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const whatsappService = require('../utils/whatsappService');

router.post('/mark', attendanceController.markAttendance);
router.post('/', attendanceController.markAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.get('/student/:studentId', attendanceController.getAttendanceByStudent);
router.get('/class/:classId/date/:date', attendanceController.getAttendanceByClassAndDate);
router.get('/stats', attendanceController.getAttendanceStats);
router.get('/monthly', attendanceController.getAttendanceMonthly);
router.get('/monthly-student', attendanceController.getAttendanceMonthlyStudent);

// WhatsApp Status Check (Simple)
router.get('/whatsapp/status', (req, res) => {
  try {
    const isReady = whatsappService.isClientReady();
    res.json({
      status: isReady ? 'ready' : 'initializing',
      isReady,
      message: isReady ? 'WhatsApp client is ready' : 'WhatsApp client is initializing. Please scan QR code.',
    });
  } catch (error) {
    console.error('Error in /whatsapp/status:', error);
    res.status(500).json({ error: error.message });
  }
});

// WhatsApp QR Code and Status (for admin panel)
router.get('/whatsapp/qr-status', (req, res) => {
  try {
    const qrStatus = whatsappService.getQRStatus();
    console.log('📡 QR Status requested - Returning:', {
      hasQR: !!qrStatus.qr,
      status: qrStatus.status,
      isReady: qrStatus.isReady,
    });
    res.json(qrStatus);
  } catch (error) {
    console.error('Error in /whatsapp/qr-status:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/whatsapp/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const history = whatsappService.getHistory(limit);
    res.json({ history, count: history.length });
  } catch (error) {
    console.error('Error in /whatsapp/history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
