/**
 * LiveTestPage - PRESENTATION LAYER
 *
 * RESPONSIBILITY:
 *   - Display test interface
 *   - Show questions with different types (MCQ, TEXT, BOOL, CODE)
 *   - Display leaderboard sidebar
 *   - Show loading state
 *   - Show test complete state
 *   - Handle user interactions (pass to handlers from props)
 *
 * STATE RECEIVED FROM PARENT:
 *   - All tests states (loading, questions, answers, etc)
 *   - All handlers (onAnswerChange, onSubmitAnswer)
 *
 * ZERO BUSINESS LOGIC - Only rendering and styling
 */

import { motion } from 'framer-motion';
import { BookOpen, Send, AlertCircle, Loader } from 'lucide-react';

export default function LiveTestUI({
  loading,
  error,
  sessionEnded,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  progressPercentage,
  answers,
  leaderboard,
  submitted,
  onAnswerChange,
  onSubmitAnswer,
}) {
  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <Loader size={48} className="text-[#6366f1] animate-spin" />
          <p className="text-[#64748b] text-sm">Loading test...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-screen bg-[#0a0a0f] flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Test Error</h2>
          <p className="text-[#64748b] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#6366f1] text-white rounded-lg font-semibold hover:bg-[#4f46e5]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Session ended - Results state
  if (sessionEnded) {
    return (
      <div className="w-full h-screen bg-[#0a0a0f] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-black text-[#e2e8f0] mb-2">
            Test Complete!
          </h2>
          <p className="text-[#64748b] mb-8">Thanks for participating!</p>

          {/* Final Leaderboard */}
          <div className="bg-[#13131f] border border-[#1e1e2f] rounded-xl p-6">
            <h3 className="text-lg font-black text-[#e2e8f0] mb-4">
              Final Rankings
            </h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).length > 0 ? (
                leaderboard.slice(0, 5).map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded"
                  >
                    <span className="text-[#e2e8f0] font-bold flex items-center gap-2">
                      {idx === 0 && <span className="text-lg">🥇</span>}
                      {idx === 1 && <span className="text-lg">🥈</span>}
                      {idx === 2 && <span className="text-lg">🥉</span>}#
                      {idx + 1} {entry.name}
                    </span>
                    <span className="text-[#6366f1] font-bold">
                      {entry.score} pts
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[#64748b] text-sm">
                  No final rankings available
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active test state
  return (
    <div className="w-full h-screen flex bg-[#0a0a0f]">
      {/* Main Test Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-[#13131f] border border-[#1e1e2f] rounded-xl p-8">
            {/* Question Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6366f1]/20 rounded-full mb-6">
              <BookOpen size={14} className="text-[#6366f1]" />
              <span className="text-xs font-bold text-[#6366f1]">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#0a0a0f] rounded-full h-2 mb-8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"
              />
            </div>

            {/* Question Content */}
            {currentQuestion && (
              <motion.div
                key={currentQuestion._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Question Text */}
                <h2 className="text-2xl font-black text-[#e2e8f0]">
                  {currentQuestion.questionText}
                </h2>

                {/* Question Type: MCQ (Multiple Choice) */}
                {currentQuestion.type === 'MCQ' && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onAnswerChange(idx)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          answers[currentQuestion._id] === idx
                            ? 'border-[#6366f1] bg-[#6366f1]/20'
                            : 'border-[#1e1e2f] bg-[#0a0a0f] hover:border-[#6366f1]/50'
                        }`}
                      >
                        <span className="font-semibold text-[#e2e8f0]">
                          {option}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Question Type: TEXT Input */}
                {currentQuestion.type === 'TEXT' && (
                  <input
                    type="text"
                    placeholder="Enter your answer..."
                    value={answers[currentQuestion._id] || ''}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#1e1e2f] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-[#6366f1] transition-colors"
                  />
                )}

                {/* Question Type: BOOL (True/False) */}
                {currentQuestion.type === 'BOOL' && (
                  <div className="flex gap-4">
                    {[
                      { label: 'True', value: true },
                      { label: 'False', value: false },
                    ].map((option) => (
                      <motion.button
                        key={option.label}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onAnswerChange(option.value)}
                        className={`flex-1 p-4 font-bold rounded-lg border-2 transition-all ${
                          answers[currentQuestion._id] === option.value
                            ? 'border-[#6366f1] bg-[#6366f1]/20 text-[#6366f1]'
                            : 'border-[#1e1e2f] bg-[#0a0a0f] text-[#e2e8f0] hover:border-[#6366f1]/50'
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Question Type: CODE */}
                {currentQuestion.type === 'CODE' && (
                  <div className="space-y-3">
                    <p className="text-sm text-[#64748b]">
                      Language:{' '}
                      <span className="text-[#6366f1] font-semibold">
                        {currentQuestion.codeLanguage || 'JavaScript'}
                      </span>
                    </p>
                    {currentQuestion.starterCode && (
                      <div className="bg-[#0a0a0f] p-4 rounded-lg border border-[#1e1e2f]">
                        <p className="text-xs text-[#64748b] mb-2">
                          Starter Code:
                        </p>
                        <pre className="text-xs text-[#6366f1] overflow-x-auto font-mono">
                          {currentQuestion.starterCode}
                        </pre>
                      </div>
                    )}
                    <textarea
                      placeholder="Write your code here..."
                      value={answers[currentQuestion._id] || ''}
                      onChange={(e) => onAnswerChange(e.target.value)}
                      className="w-full h-48 px-4 py-3 bg-[#0a0a0f] border border-[#1e1e2f] rounded-lg text-[#e2e8f0] font-mono text-sm focus:outline-none focus:border-[#6366f1] transition-colors"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSubmitAnswer}
                  disabled={submitted}
                  className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  <Send size={18} />
                  {submitted ? 'Submitted...' : 'Submit Answer'}
                </motion.button>

                {submitted && (
                  <p className="text-center text-sm text-[#6366f1] animate-pulse">
                    ✓ Answer submitted. Loading next question...
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="w-80 bg-[#0f0f1a] border-l border-[#1e1e2f] p-6 overflow-y-auto">
        <div className="sticky top-0 bg-[#0f0f1a] pb-4 mb-4 border-b border-[#1e1e2f]">
          <h3 className="text-lg font-black text-[#e2e8f0]">
            📊 Live Leaderboard
          </h3>
          <p className="text-xs text-[#64748b] mt-1">Real-time rankings</p>
        </div>

        <div className="space-y-2">
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  i === 0
                    ? 'bg-[#6366f1]/20 border border-[#6366f1] shadow-lg shadow-[#6366f1]/10'
                    : 'bg-[#13131f] border border-[#1e1e2f]'
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0
                        ? 'bg-[#6366f1] text-white'
                        : 'bg-[#1e1e2f] text-[#64748b]'
                    }`}
                  >
                    {i === 0 && '🥇'}
                    {i === 1 && '🥈'}
                    {i === 2 && '🥉'}
                    {i > 2 && i + 1}
                  </div>
                  <span className="text-sm font-semibold text-[#e2e8f0] truncate">
                    {entry.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    i === 0 ? 'text-[#6366f1]' : 'text-[#64748b]'
                  }`}
                >
                  {entry.score} pts
                </span>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-sm text-[#64748b]">
                Waiting for first submissions...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
