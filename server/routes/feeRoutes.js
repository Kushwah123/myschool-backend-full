const express = require('express');
const router = express.Router();
const {
  createFeeStructure,
  getFeeHistoryByParent,
  payFee,
  getStudentPayments,  // ✅ Ensure this line matches the function name
  getFeeStructures,
  assignFeeToStudent,
  getAllAssignedFees,
  getAssignedFeesParentWise,
  payInstallment
} = require('../controllers/feeController');


// Create fee structure
router.post('/structure',  createFeeStructure);
router.get('/structure',  getFeeStructures);

router.post('/assign', assignFeeToStudent);
// router.get('/assign', getAllAssignedFees);

// Make payment
router.post('/pay',  payFee);

// Get payments by student
router.get('/:studentId',  getStudentPayments);
router.get('/history/parent/:parentId', getFeeHistoryByParent);
router.get('/assigned-fees/parent-wise', getAssignedFeesParentWise);
router.post('/assign/:assignedFeeId/installment/:installmentId/pay', payInstallment);

module.exports = router;
