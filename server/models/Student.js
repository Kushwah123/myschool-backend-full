const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  fatherName: { type: String, required: true, trim: true },
  motherName: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  mobile: { type: String, index: true, default: '' },
  dob: { type: Date },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', index: true },
  gender: { type: String, default: 'N/A' },
  bloodGroup: { type: String, default: '' },
  category: { type: String, default: '' },
  aadharNumber: { type: String, unique: true, sparse: true, index: true, default: undefined },
  admissionNumber: { type: String, required: true, unique: true, index: true },
  rollNumber: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

// ✅ Compound indexes for frequent queries
studentSchema.index({ classId: 1, admissionNumber: 1 });
studentSchema.index({ villageId: 1, classId: 1 });

module.exports = mongoose.model('Student', studentSchema);