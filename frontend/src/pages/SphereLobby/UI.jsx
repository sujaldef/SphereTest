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
      <div className="w-full h-full p-8 bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 bg-[#6366f1] rounded-lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full p-8 bg-[#0a0a0f] flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-[#e2e8f0] text-lg">{error}</p>
          <button
            onClick={onReturnDashboard}
            className="mt-4 px-6 py-2 bg-[#6366f1] text-white rounded-lg font-bold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 bg-[#0a0a0f]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mt-20"
      >
        <div className="bg-[#13131f] border border-[#1e1e2f] rounded-2xl p-12 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#6366f1]/20 rounded-full mb-6">
            <Users size={40} className="text-[#6366f1]" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black text-[#e2e8f0] mb-2">
            {sphere?.title || 'Sphere'}
          </h1>

          {/* Status Message */}
          <p className="text-[#64748b] mb-8 text-lg">
            {joiningActive
              ? 'Joining active session...'
              : autoStarting
                ? 'Session starting...'
                : isAdmin
                  ? 'Ready to start the test'
                  : 'Waiting for the test to start'}
          </p>

          {/* Participant Count */}
          <div className="inline-block px-6 py-3 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-lg mb-8">
            <p className="text-sm text-[#64748b]">Participants</p>
            <p className="text-3xl font-black text-[#6366f1]">{participants}</p>
          </div>

          {/* Auto-start Countdown */}
          {countdownSeconds !== null && countdownSeconds > 0 && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-400" />
                <p className="text-yellow-400 font-bold">
                  Auto-starting in {countdownSeconds} second
                  {countdownSeconds !== 1 ? 's' : ''}
                </p>
              </div>
              <p className="text-sm text-yellow-300/70">
                Session will start automatically at scheduled time
              </p>
            </div>
          )}

          {/* Late Join Indicator */}
          {joiningActive && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <LogIn size={20} className="text-green-400" />
                <p className="text-green-400 font-bold">
                  Joining Active Session
                </p>
              </div>
              <p className="text-sm text-green-300/70">
                Opening test in new tab...
              </p>
            </div>
          )}

          {/* Admin Start Button */}
          {isAdmin && (
            <motion.button
              whileHover={!autoStarting ? { scale: 1.05 } : {}}
              whileTap={!autoStarting ? { scale: 0.95 } : {}}
              onClick={onStartSession}
              disabled={autoStarting}
              className={`flex items-center gap-2 mx-auto px-8 py-3 font-bold rounded-lg mb-6 ${
                autoStarting
                  ? 'bg-green-600/50 text-white/50 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <Play size={20} />{' '}
              {autoStarting ? 'Session Starting...' : 'Start Session'}
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
                className="w-3 h-3 bg-[#6366f1] rounded-full"
              />
            ))}
          </div>

          {/* Footer Message */}
          <p className="text-[#64748b] text-sm">
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
