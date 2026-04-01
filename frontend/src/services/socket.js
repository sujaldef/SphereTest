import { io } from 'socket.io-client';

let socket = null;

/**
 * Connect to Socket.io server with auth token
 */
export const connectSocket = (token) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  socket = io(apiUrl, {
    auth: {
      token: `Bearer ${token}`,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  return socket;
};

/**
 * Disconnect from Socket.io server
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Emit start_session event (admin only)
 */
export const emitStartSession = (sphereId) => {
  if (!socket) return;
  socket.emit('start_session', {
    sphereId,
    startTime: new Date(),
  });
};

/**
 * Emit submit_answer event (student)
 */
export const emitSubmitAnswer = ({ sphereId, questionId, answer, userId }) => {
  if (!socket) return;
  socket.emit('submit_answer', {
    sphereId,
    questionId,
    answer,
    userId,
  });
};

/**
 * Emit session_end event (admin only)
 */
export const emitSessionEnd = (sphereId) => {
  if (!socket) return;
  socket.emit('session_end', { sphereId });
};

/**
 * Listen for leaderboard updates
 */
export const onLeaderboardUpdate = (callback) => {
  if (!socket) return;
  socket.on('leaderboard_update', callback);
};

/**
 * Listen for session started event
 */
export const onSessionStarted = (callback) => {
  if (!socket) return;
  socket.on('session_started', callback);
};

/**
 * Listen for session ended event
 */
export const onSessionEnded = (callback) => {
  if (!socket) return;
  socket.on('session_ended', callback);
};

/**
 * Listen for answer received event
 */
export const onAnswerReceived = (callback) => {
  if (!socket) return;
  socket.on('answer_received', callback);
};

/**
 * Listen for progress update event
 */
export const onProgressUpdate = (callback) => {
  if (!socket) return;
  socket.on('progress_update', callback);
};

/**
 * Get socket instance
 */
export const getSocket = () => socket;

/**
 * Remove listener
 */
export const removeSocketListener = (event) => {
  if (!socket) return;
  socket.off(event);
};
