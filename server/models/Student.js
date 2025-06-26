const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  aadharNumber: String,
  bloodGroup: String,
  category: String,
  photo: String,
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  sectionId: String,
  transportMode: String,
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);