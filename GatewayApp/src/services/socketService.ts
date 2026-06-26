/**
 * Socket.IO Service - Manages connection to backend
 */
import io, { Socket } from 'socket.io-client';
import { useGatewayStore } from '../store/gatewayStore';
import { handleIncomingCall } from './callService';
import { setSocketInstance, getSocketInstance } from './socketManager';


let heartbeatInterval: ReturnType<typeof setInterval> | null = null;




export const connectToBackend = async (
  backendUrl: string,
  deviceId: string,
  deviceName: string,
  simNumber: string
) => {
  try {
    console.log('[SocketService] Connecting to:', backendUrl);
    console.log('[SocketService] Device Info:', {
      deviceId,
      deviceName,
      simNumber,
    });

    const existing = getSocketInstance();

    if (existing?.connected) {
      existing.disconnect();
    }

    const nextSocket = io(backendUrl, {

      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      transports: [ 'polling'],
      forceNew: false,
    });

    // Connection events
    nextSocket.on('connect', () => {

      console.log('[SocketService] Connected to backend');
      console.log('[SocketService] Socket ID:', nextSocket.id);
      useGatewayStore.setState({ isConnected: true, connectionStatus: 'Registering...' });
      
      // Register device
      registerDevice(deviceId, deviceName, simNumber);
      
      // Start heartbeat
      startHeartbeat();
    });

    nextSocket.on('disconnect', () => {

      console.log('[SocketService] Disconnected from backend');
      useGatewayStore.setState({ isConnected: false, connectionStatus: 'Disconnected' });
      stopHeartbeat();
    });

    nextSocket.on('connect_error', (error) => {

      console.error('[SocketService] Connection error:', error);
      console.error('[SocketService] Error message:', error?.message);
      useGatewayStore.setState({ connectionStatus: `Error: ${error.message}` });
    });


    // Gateway events
    nextSocket.on('gateway:registered', (data) => {

      console.log('[SocketService] Gateway registered:', data);
      useGatewayStore.setState({ connectionStatus: 'Connected & Ready' });
    });

    nextSocket.on('gateway:place-call', (payload) => {

      console.log('[SocketService] Incoming call request:', payload);
      handleIncomingCall(payload);
    });

    nextSocket.on('gateway:error', (error) => {

      console.error('[SocketService] Gateway error:', error);
      useGatewayStore.setState({ connectionStatus: `Gateway Error: ${error.msg}` });
    });

    setSocketInstance(nextSocket);
    nextSocket.connect();


  } catch (error) {
    console.error('[SocketService] Connection failed:', error);
    useGatewayStore.setState({ connectionStatus: 'Connection Failed' });
  }
};

export const disconnectFromBackend = () => {
  stopHeartbeat();
  const current = getSocketInstance();
  if (current?.connected) {
    current.disconnect();
  }
  setSocketInstance(null);

};

const registerDevice = (deviceId: string, deviceName: string, simNumber: string) => {
  const socket = getSocketInstance();
  if (!socket) return;

  socket.emit('gateway:register', {

    deviceId,
    deviceName,
    simNumber,
  });
  console.log('[SocketService] Sent registration for device:', deviceId);
};

const startHeartbeat = () => {
  stopHeartbeat();
  
  heartbeatInterval = setInterval(() => {
    const socket = getSocketInstance();
    if (socket?.connected) {
      socket.emit('gateway:heartbeat', {});

      console.log('[SocketService] Heartbeat sent');
    }
  }, 20000); // 20 seconds
};

const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};



// Kept for backward compatibility (if other modules import it)
export const getSocket = (): Socket | null => getSocketInstance();

