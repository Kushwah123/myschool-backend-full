const mongoose = require('mongoose');

const gatewayDeviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    deviceName: { type: String, default: '' },
    simNumber: { type: String, required: true },
    isOnline: { type: Boolean, default: false, index: true },
    isBusy: { type: Boolean, default: false, index: true },
    socketId: { type: String, default: '' },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GatewayDevice', gatewayDeviceSchema);

