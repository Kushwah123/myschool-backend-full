const jwt = require('jsonwebtoken');
const CallLog = require('../models/CallLog');
const {
  registerDevice,
  markDeviceOffline,
  setDeviceBusy,
  touchDevice,
} = require('../services/callGatewayService');

const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  return Math.max(0, Math.floor((new Date(endTime) - new Date(startTime)) / 1000));
};

const validStatuses = new Set(['calling', 'connected', 'busy', 'failed', 'completed']);

const initCallSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('teacher:join', ({ token }) => {
      try {
        if (!token) return;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.join(`teacher:${decoded.id}`);
      } catch (error) {
        socket.emit('call:error', { msg: 'Invalid token for socket join' });
      }
    });

    socket.on('gateway:register', async (payload = {}) => {
      try {
        const { deviceId, deviceName, simNumber } = payload;
        if (!deviceId) {
          socket.emit('gateway:error', { msg: 'deviceId is required' });
          return;
        }

        socket.data.gatewayDeviceId = deviceId;
        await registerDevice({ deviceId, deviceName, simNumber, socketId: socket.id });
        socket.emit('gateway:registered', { success: true, deviceId, simNumber: simNumber || null });
      } catch (error) {
        console.error('gateway:register error:', error);
        socket.emit('gateway:error', { msg: 'Gateway registration failed' });
      }
    });

    socket.on('gateway:heartbeat', async () => {
      if (!socket.data.gatewayDeviceId) return;
      await touchDevice(socket.data.gatewayDeviceId);
    });

    socket.on('gateway:call-status', async (payload = {}) => {
      try {
        const { callId, status } = payload;
        if (!callId || !status || !validStatuses.has(status)) {
          socket.emit('gateway:error', { msg: 'callId and valid status are required' });
          return;
        }

        const call = await CallLog.findById(callId);
        if (!call) {
          socket.emit('gateway:error', { msg: 'Call not found' });
          return;
        }

        const update = { callStatus: status };
        if (status === 'connected' && !call.startTime) {
          update.startTime = new Date();
        }
        if (['busy', 'failed', 'completed'].includes(status)) {
          update.endTime = new Date();
          const start = call.startTime || new Date();
          update.duration = calculateDuration(start, update.endTime);
        }

        const updatedCall = await CallLog.findByIdAndUpdate(callId, update, { new: true });

        io.to(`teacher:${call.teacherId.toString()}`).emit('call:update', {
          callId: updatedCall._id.toString(),
          status: updatedCall.callStatus,
          studentName: updatedCall.studentName,
          parentNumber: updatedCall.parentNumber,
          startTime: updatedCall.startTime,
          endTime: updatedCall.endTime,
          duration: updatedCall.duration,
        });

        if (['busy', 'failed', 'completed'].includes(status)) {
          await setDeviceBusy(call.gatewayDeviceId, false);
        }
      } catch (error) {
        console.error('gateway:call-status error:', error);
        socket.emit('gateway:error', { msg: 'Failed to update call status' });
      }
    });

    socket.on('disconnect', async () => {
      if (socket.data.gatewayDeviceId) {
        await markDeviceOffline(socket.data.gatewayDeviceId);
      }
    });
  });
};

module.exports = initCallSocket;

