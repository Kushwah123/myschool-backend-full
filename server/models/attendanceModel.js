const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true }
});

attendanceSchema.index({ student: 1, date: 1 }, { unique: true }); // Prevent duplicate

module.exports = mongoose.model('Attendance', attendanceSchema);
