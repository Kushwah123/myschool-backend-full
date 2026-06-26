const GatewayDevice = require('../models/GatewayDevice');

const activeDevices = new Map();

const registerDevice = async ({ deviceId, deviceName, simNumber, socketId }) => {
  const existing = await GatewayDevice.findOne({ deviceId }).lean();
  const resolvedSim = simNumber || existing?.simNumber || '';

  activeDevices.set(deviceId, {
    deviceId,
    deviceName: deviceName || deviceId,
    simNumber: resolvedSim,
    socketId,
    isBusy: false,
    isOnline: true,
  });

  await GatewayDevice.findOneAndUpdate(
    { deviceId },
    {
      deviceId,
      deviceName: deviceName || deviceId,
      simNumber: resolvedSim,
      socketId,
      isOnline: true,
      isBusy: false,
      lastSeenAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const markDeviceOffline = async (deviceId) => {
  activeDevices.delete(deviceId);
  await GatewayDevice.findOneAndUpdate(
    { deviceId },
    { isOnline: false, isBusy: false, socketId: '', lastSeenAt: new Date() }
  );
};

const setDeviceBusy = async (deviceId, isBusy) => {
  const device = activeDevices.get(deviceId);
  if (device) {
    device.isBusy = isBusy;
  }

  await GatewayDevice.findOneAndUpdate(
    { deviceId },
    { isBusy, lastSeenAt: new Date() }
  );
};

const getAvailableDevice = () => {
  for (const device of activeDevices.values()) {
    if (device.isOnline && !device.isBusy) {
      return device;
    }
  }
  return null;
};

const touchDevice = async (deviceId) => {
  await GatewayDevice.findOneAndUpdate({ deviceId }, { lastSeenAt: new Date() });
};

const updateDeviceSim = async (deviceId, simNumber) => {
  const updated = await GatewayDevice.findOneAndUpdate(
    { deviceId },
    { simNumber, lastSeenAt: new Date() },
    { new: true }
  );

  const device = activeDevices.get(deviceId);
  if (device) {
    device.simNumber = simNumber;
  }

  return updated;
};

const getGatewayDevices = async () => {
  return GatewayDevice.find().sort({ updatedAt: -1 }).lean();
};

const upsertGatewayDeviceByAdmin = async ({ deviceId, deviceName, simNumber }) => {
  const updated = await GatewayDevice.findOneAndUpdate(
    { deviceId },
    {
      deviceId,
      deviceName: deviceName || deviceId,
      simNumber,
      lastSeenAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const device = activeDevices.get(deviceId);
  if (device) {
    device.deviceName = deviceName || device.deviceName || deviceId;
    device.simNumber = simNumber;
  }

  return updated;
};

module.exports = {
  registerDevice,
  markDeviceOffline,
  setDeviceBusy,
  getAvailableDevice,
  touchDevice,
  updateDeviceSim,
  getGatewayDevices,
  upsertGatewayDeviceByAdmin,
};

