const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  date: { type: Date, required: true, index: true },
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
