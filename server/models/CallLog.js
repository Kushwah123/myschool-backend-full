const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teacherName: { type: String, required: true },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    studentName: { type: String, required: true },
    parentNumber: { type: String, required: true },
    gatewayDeviceId: { type: String, required: true, index: true },
    simNumber: { type: String, required: true },
    callStatus: {
      type: String,
      enum: ['calling', 'connected', 'busy', 'failed', 'completed'],
      default: 'calling',
      index: true,
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: null },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CallLog', callLogSchema);

