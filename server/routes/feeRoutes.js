const express = require('express');
const router = express.Router();
const { createFeeStructure, getFeeHistoryByParent, payFee, getStudentPayments } = require('../controllers/feeController');
const { protect } = require('../middlewares/authMiddleware');

// Create fee structure
router.post('/structure', protect, createFeeStructure);

// Make payment
router.post('/pay', protect, payFee);

// Get payments by student
router.get('/:studentId', protect, getStudentPayments);
router.get('/history/parent/:parentId', getFeeHistoryByParent);

module.exports = router;
