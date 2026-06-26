/**
 * School SIM Gateway - Redux Store
 * State management for Socket.IO connection and call status
 */
import { create } from 'zustand';

interface GatewayState {
  // Connection
  isConnected: boolean;
  connectionStatus: string;
  deviceId: string;
  
  // Settings
  backendUrl: string;
  deviceName: string;
  simNumber: string;
  
  // Call Status
  currentCallId: string | null;
  currentCallStatus: 'idle' | 'calling' | 'connected' | 'busy' | 'failed' | 'completed';
  callStartTime: number | null;
  
  // Actions
  setConnected: (connected: boolean) => void;
  setConnectionStatus: (status: string) => void;
  updateSettings: (settings: Partial<GatewayState>) => void;
  setCurrentCall: (callId: string, status: string, startTime: number) => void;
  clearCurrentCall: () => void;
}

export const useGatewayStore = create<GatewayState>((set) => ({
  // Initial state
  isConnected: false,
  connectionStatus: 'Disconnected',
  deviceId: 'SCHOOL-GATEWAY-01',
  backendUrl: 'http://192.168.1.100:5000',
  deviceName: 'Reception Phone',
  simNumber: '+91XXXXXXXXXX',
  currentCallId: null,
  currentCallStatus: 'idle',
  callStartTime: null,
  
  // Actions
  setConnected: (connected: boolean) => 
    set({ isConnected: connected, connectionStatus: connected ? 'Connected' : 'Disconnected' }),
  
  setConnectionStatus: (status: string) => 
    set({ connectionStatus: status }),
  
  updateSettings: (settings: Partial<GatewayState>) => 
    set((state) => ({ ...state, ...settings })),
  
  setCurrentCall: (callId: string, status: string, startTime: number) =>
    set({ currentCallId: callId, currentCallStatus: status as any, callStartTime: startTime }),
  
  clearCurrentCall: () =>
    set({ currentCallId: null, currentCallStatus: 'idle', callStartTime: null }),
}));
