const mongoose = require('mongoose');

const assignedFeeSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  },
  villageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Village',
  },
  totalAmount: Number,
  installments: [
  {
    dueDate: Date,
    amount: Number,
    status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
    paidDate: Date,
    paidAmount: { type: Number, default: 0 },
    lateFee: { type: Number, default: 0 }
  }
]
,
  openingBalance: Number,
  feeStructureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeStructure',
  }
});

const AssignedFee = mongoose.model('AssignedFee', assignedFeeSchema);

module.exports = AssignedFee;
