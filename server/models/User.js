// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  // new username field – unique but sparse so legacy docs without it are allowed
  username: { type: String, unique: true, sparse: true, trim: true, index: true },
  mobile: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student', 'parent', 'accountant'],
    required: true,
    index: true
  },
  linkedId: { type: mongoose.Schema.Types.ObjectId, refPath: 'roleRef' },
  roleRef: {
    type: String,
    enum: ['Admin', 'Accountant', 'Teacher', 'Student', 'Parent']
  },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

// ✅ Compound indexes
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);
