const FeeStructure = require('../models/FeeStructure');
const FeePayment = require('../models/FeePayment');

exports.createFeeStructure = async (req, res) => {
  try {
    const { classId, amount, installments } = req.body;
    const fee = await FeeStructure.create({ classId, amount, installments });
    res.status(201).json({ message: "Fee structure created", fee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
