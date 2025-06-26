const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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
