const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }], // Multiple classes support
  subject: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  dueDate: Date,
  fileUrl: String,
  
  // WhatsApp Tracking
  whatsappStatus: { 
    type: String, 
    enum: ['pending', 'sending', 'completed', 'failed'], 
    default: 'pending' 
  },
  sentAt: Date,
  recipients: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
    phoneNumber: String,
    status: { 
      type: String, 
      enum: ['pending', 'sent', 'failed'], 
      default: 'pending' 
    },
    sentTime: Date,
    errorReason: String
  }],
  
  // Tracking
  totalRecipients: { type: Number, default: 0 },
  successfulSends: { type: Number, default: 0 },
  failedSends: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for frequent queries
homeworkSchema.index({ teacher: 1, createdAt: -1 });
homeworkSchema.index({ classIds: 1, createdAt: -1 });
homeworkSchema.index({ whatsappStatus: 1 });

module.exports = mongoose.model('Homework', homeworkSchema);
