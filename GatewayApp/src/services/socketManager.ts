/**
 * Socket Manager
 * Single source of truth for Socket.IO instance.
 *
 * IMPORTANT: Must not import socketService or callService to avoid require cycles.
 */

import type { Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export const setSocketInstance = (socket: Socket | null) => {
  socketInstance = socket;
};

export const getSocketInstance = (): Socket | null => socketInstance;

