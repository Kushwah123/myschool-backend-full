const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  amount: Number,
  installments: [
    {
      name: String,
      dueDate: Date,
      amount: Number
    }
  ]
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
