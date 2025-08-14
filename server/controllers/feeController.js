const FeeStructure = require('../models/FeeStructure');
const FeePayment = require('../models/FeePayment');
const asyncHandler = require('express-async-handler');
const  AssignedFee = require('../models/AssignedFee');
const Student = require('../models/Student');
const Parent = require('../models/Parent');


exports.createFeeStructure = async (req, res) => {
  try {
    const { classId, amount, installments } = req.body;
    const fee = await FeeStructure.create({ classId, amount, installments });
    res.status(201).json({ message: "Fee structure created", fee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFeeStructures = asyncHandler(async (req, res) => {
  try {
    const structures = await FeeStructure.find();
    res.json(structures);
  } catch (error) {
    console.error('Error fetching fee structures:', error.message);
    res.status(500).json({ message: 'Server error while fetching fee structures' });
  }
});


exports.payFee = async (req, res) => {
  try {
    const { studentId, installmentName, amountPaid, mode } = req.body;

    const payment = await FeePayment.create({
      student: studentId,
      installmentName,
      amountPaid,
      paymentDate: new Date(),
      receiptId: `RCPT-${Date.now()}`,
      mode
    });

    res.status(201).json({ message: "Fee payment recorded", payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudentPayments = async (req, res) => {
  try {
    const payments = await FeePayment.find({ student: req.params.studentId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getFeeHistoryByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const history = await Fee.find({ parent: parentId })
      .populate('student')
      .populate('classId');
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignFeeToStudent = async (req, res) => {
  try {
  
    const { parentId,  totalAmount, installments, openingBalance, villageId } = req.body;

    const assignedFee = new AssignedFee({
      parentId,         // correct key   // make sure this exists in frontend too
      totalAmount,
      installments,
      openingBalance,
      villageId         // if you want to store this also
    });

    await assignedFee.save();

    res.status(201).json({ message: 'Fee assigned successfully', assignedFee });
  } catch (error) {
    console.error('Error assigning fee:', error);
    res.status(500).json({ message: 'Error assigning fee', error: error.message });
  }
};


exports.getAssignedFeesParentWise = async (req, res) => {
  try {
    const today = new Date();
    const fees = await AssignedFee.find()
  .populate({
    path: 'parentId',
    select: 'fullName mobile Village',
    populate: [
      { path: 'villageId', select: 'Village' }, // parent ka village ka naam
      { path: 'studentIds', select: 'fullName rollNumber classId', 
        populate: { path: 'classId', select: 'className section' }
      }
    ]
  });
      fees.forEach(fee => {
      fee.installments.forEach(inst => {
        if (inst.status === "pending" && new Date(inst.dueDate) < today) {
          inst.status = "overdue";
          const daysLate = Math.floor((today - new Date(inst.dueDate)) / (1000 * 60 * 60 * 24));
          inst.lateFee = daysLate * 0; // ₹10 per day
        }
      });
    });
console.log(fees);
    res.status(200).json(fees);
  } catch (error) {
    console.error("Error fetching parent-wise fees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// controllers/feeController.js


exports.payInstallment = async (req, res) => {
  try {
    const { assignedFeeId, installmentId } = req.params;
    const { paidAmount, paymentMode } = req.body;

    const fee = await AssignedFee.findById(assignedFeeId).populate('parentId', 'fullName mobile');
    if (!fee) return res.status(404).json({ success: false, message: 'AssignedFee not found' });

    const inst = fee.installments.id(installmentId);
    if (!inst) return res.status(404).json({ success: false, message: 'Installment not found' });

    const today = new Date();

    // Late fee calculation if overdue and still pending
    if (inst.status !== 'paid' && new Date(inst.dueDate) < today) {
      const daysLate = Math.floor((today - new Date(inst.dueDate)) / (1000 * 60 * 60 * 24));
      const perDayLate = 10; // change as per rules
      inst.lateFee = daysLate * perDayLate;
      inst.status = 'overdue';
    }

    // Accept payment (we assume full payment of that installment + lateFee)
    const totalDue = (inst.amount || 0) + (inst.lateFee || 0);
    inst.paidAmount = paidAmount ?? totalDue;
    inst.paidDate = today;
    inst.paymentMode = paymentMode || 'cash';
    inst.status = 'paid';

    await fee.save();

    // Create a receipt object to return (can be saved if you want)
    const receipt = {
      receiptId: `RCPT-${Date.now()}`,
      parent: fee.parentId ? { id: fee.parentId._id, name: fee.parentId.fullName, mobile: fee.parentId.mobile } : null,
      assignedFeeId: fee._id,
      installmentId: inst._id,
      paidAmount: inst.paidAmount,
      lateFee: inst.lateFee || 0,
      paymentMode: inst.paymentMode,
      paidDate: inst.paidDate,
    };

    return res.status(200).json({ success: true, message: 'Payment recorded', fee, receipt });
  } catch (err) {
    console.error('payInstallment error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};



