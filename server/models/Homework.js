const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  title: String,
  description: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subject: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  dueDate: Date,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Homework', homeworkSchema);
