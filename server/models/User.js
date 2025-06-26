// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student', 'parent', 'accountant'],
    required: true
  },
  linkedId: { type: mongoose.Schema.Types.ObjectId, refPath: 'roleRef' }, // Optional
  roleRef: {
    type: String,
    enum: ['Admin', 'Accountant', 'Teacher', 'Student', 'Parent']
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
