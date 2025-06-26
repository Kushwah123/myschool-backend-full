const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  installmentName: String,
  amountPaid: Number,
  paymentDate: Date,
  receiptId: String,
  mode: String
});

module.exports = mongoose.model('FeePayment', feePaymentSchema);
