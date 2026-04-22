const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, alias: 'student' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, alias: 'subject' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number },
  grade: { type: String },
  date: { type: Date, default: Date.now }
});

// pre-save hook to calculate grade/percentage
marksSchema.pre('save', function(next) {
  if (this.marksObtained != null && this.totalMarks) {
    this.percentage = (this.marksObtained / this.totalMarks) * 100;
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B';
    else if (this.percentage >= 60) this.grade = 'C';
    else if (this.percentage >= 50) this.grade = 'D';
    else this.grade = 'F';
  }
  next();
});

module.exports = mongoose.model('Marks', marksSchema);
