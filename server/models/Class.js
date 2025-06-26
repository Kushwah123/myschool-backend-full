const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Example: "Class 6"
  section: { type: String, required: true }, // Example: "A"
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // optional
});

module.exports = mongoose.model('Class', classSchema);
