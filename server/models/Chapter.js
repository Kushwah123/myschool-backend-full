const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  maxMarks: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
