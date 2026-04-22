const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  date: { type: Date, required: true, index: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true }
});

attendanceSchema.index({ student: 1, date: 1 }, { unique: true }); // Prevent duplicate

module.exports = mongoose.model('Attendance', attendanceSchema);
