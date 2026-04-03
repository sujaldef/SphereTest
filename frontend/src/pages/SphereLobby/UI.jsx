import { motion } from 'framer-motion';
import { Users, Play, AlertCircle, Clock, LogIn } from 'lucide-react';

/**
 * SphereLobbyUI - Presentation Layer
 *
 * PURPOSE: Display-only waiting room UI
 *
 * RECEIVES (all as props):
 *   - loading: Initial load state
 *   - error: Error message
 *   - sphere: Sphere data
 *   - participants: Participant count
 *   - countdownSeconds: Timer until start
 *   - joiningActive: Late join in progress
 *   - autoStarting: Session starting
 *   - isAdmin: Current user is admin
 *
 * HANDLERS (from parent):
 *   - onStartSession: Admin click to start
 *   - onReturnDashboard: Error state return button
 *
 * NO:
 *   - API calls
 *   - State management
 *   - Socket events
 *   - Business logic
 */

export default function SphereLobbyUI({
  loading,
  error,
  sphere,
  participants,
  countdownSeconds,
  joiningActive,
  autoStarting,
  isAdmin,
  onStartSession,
  onReturnDashboard,
}) {
  if (loading) {
    return (
      <div className="w-full h-full p-8 global-bg flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 bg-black border-2 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full p-8 global-bg flex items-center justify-center">
        <div className="max-w-2xl text-center bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-black font-bold text-lg mb-4">{error}</p>
          <button
            onClick={onReturnDashboard}
            className="mt-4 px-6 py-2 game-box game-btn-secondary"
          >
            <div className="game-box-shadow" />
            <div className="game-box-content text-xs">Return to Dashboard</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 global-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mt-20"
      >
        <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] p-12 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-300 border-4 border-black rounded-full mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <Users size={40} className="text-black" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black text-black mb-2 uppercase">
            {sphere?.title || 'Sphere'}
          </h1>

          {/* Status Message */}
          <p className="text-black font-bold mb-8 text-lg">
            {joiningActive
              ? 'Joining active session...'
              : autoStarting
                ? 'Session starting...'
                : isAdmin
                  ? 'Ready to start the test'
                  : 'Waiting for the test to start'}
          </p>

          {/* Participant Count */}
          <div className="inline-block px-6 py-3 bg-yellow-200 border-2 border-black rounded-lg mb-8 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <p className="text-sm text-black font-black uppercase">
              Participants
            </p>
            <p className="text-3xl font-black text-black">{participants}</p>
          </div>

          {/* Auto-start Countdown */}
          {countdownSeconds !== null && countdownSeconds > 0 && (
            <div className="mb-6 p-4 bg-yellow-300 border-2 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock size={20} className="text-black" />
                <p className="text-black font-black uppercase">
                  Auto-starting in {countdownSeconds} second
                  {countdownSeconds !== 1 ? 's' : ''}
                </p>
              </div>
              <p className="text-sm text-black font-bold">
                Session will start automatically at scheduled time
              </p>
            </div>
          )}

          {/* Late Join Indicator */}
          {joiningActive && (
            <div className="mb-6 p-4 bg-green-200 border-2 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <LogIn size={20} className="text-black" />
                <p className="text-black font-black uppercase">
                  Joining Active Session
                </p>
              </div>
              <p className="text-sm text-black font-bold">
                Opening test in new tab...
              </p>
            </div>
          )}

          {/* Admin Start Button */}
          {isAdmin && (
            <motion.button
              whileHover={!autoStarting ? { y: -4 } : {}}
              onClick={onStartSession}
              disabled={autoStarting}
              className={`flex items-center gap-2 mx-auto mb-6 ${autoStarting ? 'opacity-50' : ''}`}
            >
              {!autoStarting ? (
                <div className="game-box game-btn-primary">
                  <div className="game-box-shadow" />
                  <div className="game-box-content text-xs gap-2">
                    <Play size={16} />
                    Start Session
                  </div>
                </div>
              ) : (
                <div className="px-8 py-3 font-black bg-gray-300 border-2 border-black rounded-lg text-black/50 cursor-not-allowed">
                  Session Starting...
                </div>
              )}
            </motion.button>
          )}

          {/* Loading Animation */}
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-black border border-black rounded-full"
              />
            ))}
          </div>

          {/* Footer Message */}
          <p className="text-black font-bold text-sm uppercase">
            {joiningActive
              ? 'Entering the test environment...'
              : autoStarting
                ? 'Redirecting to test...'
                : isAdmin
                  ? countdownSeconds && countdownSeconds > 0
                    ? 'You can start manually or wait for automatic start'
                    : 'Click "Start Session" to begin'
                  : 'Waiting for instructor...'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
