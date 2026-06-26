const mongoose = require('mongoose');
const CallLog = require('../models/CallLog');
const {
  getAvailableDevice,
  setDeviceBusy,
  updateDeviceSim,
  getGatewayDevices,
  upsertGatewayDeviceByAdmin,
} = require('../services/callGatewayService');

const initiateCall = async (req, res) => {
  try {
    const { studentId, studentName, parentNumber } = req.body;

    if (!studentId || !studentName || !parentNumber) {
      return res.status(400).json({
        success: false,
        msg: 'studentId, studentName and parentNumber are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, msg: 'Invalid studentId' });
    }

    const device = getAvailableDevice();
    if (!device) {
      return res.status(409).json({
        success: false,
        msg: 'No gateway device available right now',
        status: 'busy',
      });
    }
    if (!device.simNumber) {
      return res.status(409).json({
        success: false,
        msg: 'School SIM number not configured for available gateway device',
        status: 'failed',
      });
    }

    const callLog = await CallLog.create({
      teacherId: req.user._id,
      teacherName: req.user.name,
      studentId,
      studentName,
      parentNumber,
      gatewayDeviceId: device.deviceId,
      simNumber: device.simNumber,
      callStatus: 'calling',
      startTime: new Date(),
    });

    await setDeviceBusy(device.deviceId, true);

    req.app.get('io').to(device.socketId).emit('gateway:place-call', {
      callId: callLog._id.toString(),
      parentNumber,
      teacherName: req.user.name,
      studentName,
      simNumber: device.simNumber,
    });

    req.app.get('io').to(`teacher:${req.user._id.toString()}`).emit('call:update', {
      callId: callLog._id.toString(),
      status: 'calling',
      studentName,
      parentNumber,
    });

    return res.status(201).json({
      success: true,
      msg: 'Call initiated',
      data: {
        callId: callLog._id,
        status: callLog.callStatus,
        gatewayDeviceId: device.deviceId,
        simNumber: device.simNumber,
      },
    });
  } catch (error) {
    console.error('initiateCall error:', error);
    return res.status(500).json({ success: false, msg: 'Failed to initiate call' });
  }
};

const getCallHistory = async (req, res) => {
  try {
    const history = await CallLog.find({ teacherId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ success: true, data: history });
  } catch (error) {
    console.error('getCallHistory error:', error);
    return res.status(500).json({ success: false, msg: 'Failed to fetch call history' });
  }
};

const getGatewayDeviceList = async (req, res) => {
  try {
    const devices = await getGatewayDevices();
    return res.json({ success: true, data: devices });
  } catch (error) {
    console.error('getGatewayDeviceList error:', error);
    return res.status(500).json({ success: false, msg: 'Failed to fetch gateway devices' });
  }
};

const updateGatewaySimNumber = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { simNumber } = req.body;

    if (!deviceId || !simNumber) {
      return res.status(400).json({ success: false, msg: 'deviceId and simNumber are required' });
    }

    const updated = await updateDeviceSim(deviceId, simNumber);
    if (!updated) {
      return res.status(404).json({ success: false, msg: 'Gateway device not found' });
    }

    return res.json({
      success: true,
      msg: 'School SIM updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('updateGatewaySimNumber error:', error);
    return res.status(500).json({ success: false, msg: 'Failed to update school SIM' });
  }
};

const createGatewayDeviceByAdmin = async (req, res) => {
  try {
    const { deviceId, deviceName, simNumber } = req.body;

    if (!deviceId || !simNumber) {
      return res.status(400).json({ success: false, msg: 'deviceId and simNumber are required' });
    }

    const saved = await upsertGatewayDeviceByAdmin({
      deviceId: String(deviceId).trim(),
      deviceName: deviceName ? String(deviceName).trim() : '',
      simNumber: String(simNumber).trim(),
    });

    return res.status(201).json({
      success: true,
      msg: 'Gateway device saved successfully',
      data: saved,
    });
  } catch (error) {
    console.error('createGatewayDeviceByAdmin error:', error);
    return res.status(500).json({ success: false, msg: 'Failed to save gateway device' });
  }
};

module.exports = {
  initiateCall,
  getCallHistory,
  getGatewayDeviceList,
  updateGatewaySimNumber,
  createGatewayDeviceByAdmin,
};

