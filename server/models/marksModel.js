const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  examType: { type: String, required: true }, // e.g. "Mid Term", "Final", etc.
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Marks', marksSchema);
