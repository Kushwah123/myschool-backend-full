const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  mobile: {
    type: String,
    required: true,
  },

  qualification: {
    type: String,
  },

  subjectSpecialization: {
    type: String,
  },
  // teacher may handle multiple classes and subjects
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },

  dob: {
    type: Date,
  },

  address: {
    type: String,
  },

  experience: {
    type: Number,
    default: 0,
  },

  role: {
    type: String,
    default: 'teacher',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Teacher', teacherSchema);
