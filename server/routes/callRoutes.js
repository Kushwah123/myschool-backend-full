const express = require('express');
const { protect, authorize, adminOnly } = require('../middlewares/authMiddleware');
const {
  initiateCall,
  getCallHistory,
  getGatewayDeviceList,
  updateGatewaySimNumber,
  createGatewayDeviceByAdmin,
} = require('../controllers/callController');

const router = express.Router();

router.post('/initiate', protect, authorize('teacher', 'admin'), initiateCall);
router.get('/history', protect, authorize('teacher', 'admin'), getCallHistory);
router.get('/devices', protect, adminOnly, getGatewayDeviceList);
router.post('/devices', protect, adminOnly, createGatewayDeviceByAdmin);
router.put('/devices/:deviceId/sim', protect, adminOnly, updateGatewaySimNumber);

module.exports = router;

