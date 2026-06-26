/**
 * Call Service - Handles incoming call requests and SIM calling
 */
import { useGatewayStore } from '../store/gatewayStore';
import { sendCallStatusToGateway } from './callStatusService';
import { placeCallDirect } from '../native/directCall';

// Use local function alias to avoid any accidental name changes
const sendCallStatus = sendCallStatusToGateway;


export interface IncomingCallPayload {


  callId: string;
  parentNumber: string;
  teacherName: string;
  studentName: string;
  simNumber?: string;
}

// Track current call
let currentCallData: IncomingCallPayload | null = null;

export const handleIncomingCall = async (payload: IncomingCallPayload) => {
  try {
    console.log('[CallService] Handling incoming call:', payload);
    
    const { callId, parentNumber, teacherName, studentName } = payload;
    
    // Update store
    useGatewayStore.setState({
      currentCallId: callId,
      currentCallStatus: 'calling',
      callStartTime: Date.now(),
    });
    
    // Store call data
    currentCallData = payload;
    
    // Send calling status
    sendCallStatus(callId, 'calling');
    
    // Make call (direct, no dialer UI)
    await makeCall(parentNumber, callId);


    
  } catch (error) {
    console.error('[CallService] Error handling call:', error);
    if (currentCallData) {
      sendCallStatus(currentCallData.callId, 'failed');
    }
  }
};

export const makeCall = async (phoneNumber: string, callId: string) => {
  try {
    console.log('[CallService] Attempting direct call to:', phoneNumber);

    const ok = await placeCallDirect(phoneNumber);

    if (ok) {
      console.log('[CallService] Direct call intent fired to:', phoneNumber);
      // Keep it as calling. Real 'connected' requires call-state monitoring.
      useGatewayStore.setState({ currentCallStatus: 'calling' });
      sendCallStatus(callId, 'calling');
    } else {
      console.error('[CallService] Direct call failed (permission/module missing)');
      sendCallStatus(callId, 'failed');
    }
  } catch (error) {
    console.error('[CallService] Make call error:', error);
    sendCallStatus(callId, 'failed');
  }
};


export const endCall = () => {
  const { currentCallId, callStartTime } = useGatewayStore.getState();
  
  if (currentCallId && callStartTime) {
    const duration = Math.floor((Date.now() - callStartTime) / 1000);
    sendCallStatus(currentCallId, 'completed');
    console.log('[CallService] Call ended. Duration:', duration, 'seconds');
  }
  
  useGatewayStore.setState({
    currentCallId: null,
    currentCallStatus: 'idle',
    callStartTime: null,
  });
  
  currentCallData = null;
};

export const getCurrentCallData = (): IncomingCallPayload | null => currentCallData;
