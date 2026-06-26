/**
 * Call Status Service
 * Single purpose: emit call status over Socket.IO.
 *
 * REQUIREMENT: Must NOT import socketService.ts to avoid circular dependencies.
 */

import { getSocketInstance } from './socketManager';

export type CallStatus =
  | 'calling'
  | 'connected'
  | 'busy'
  | 'failed'
  | 'completed'
  | string;

export const sendCallStatusToGateway = (callId: string, status: CallStatus) => {
  const socket = getSocketInstance();

  if (!socket?.connected) {
    console.warn('[CallStatusService] Cannot send status - not connected', { callId, status });
    return;
  }

  // Keep event name + payload shape unchanged
  socket.emit('gateway:call-status', {
    callId,
    status,
  });

  console.log('[CallStatusService] Call status sent:', { callId, status });
};

