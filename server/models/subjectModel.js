const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
