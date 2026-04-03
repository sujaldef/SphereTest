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
      <div className="w-full h-screen global-bg flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-4 h-4 bg-black border border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              ></div>
            ))}
          </motion.div>
          <p className="text-black text-sm font-bold uppercase">
            Loading test...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-screen global-bg flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center bg-white border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-black mb-2 uppercase">
            TEST ERROR
          </h2>
          <p className="text-black/50 mb-4 font-bold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-yellow-300 border-2 border-black text-black rounded-lg font-bold hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  // Session ended - Results state
  if (sessionEnded) {
    return (
      <div className="w-full h-screen global-bg flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center bg-white border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-black text-black mb-2 uppercase">
            TEST COMPLETE!
          </h2>
          <p className="text-black/50 mb-8 font-bold uppercase">
            Thanks for participating!
          </p>

          {/* Final Leaderboard */}
          <div className="bg-yellow-300 border-4 border-black rounded-lg p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg font-black text-black mb-4 uppercase">
              FINAL RANKINGS
            </h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).length > 0 ? (
                leaderboard.slice(0, 5).map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white border-2 border-black rounded font-bold text-black"
                  >
                    <span className="flex items-center gap-2">
                      {idx === 0 && <span className="text-lg">🥇</span>}
                      {idx === 1 && <span className="text-lg">🥈</span>}
                      {idx === 2 && <span className="text-lg">🥉</span>}
                      {idx > 2 && (
                        <span className="text-lg font-black">#{idx + 1}</span>
                      )}{' '}
                      {entry.name}
                    </span>
                    <span className="bg-yellow-200 border border-black px-2 py-1 rounded">
                      {entry.score} PTS
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-black/50 text-sm font-bold">
                  NO FINAL RANKINGS AVAILABLE
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
    <div className="w-full h-screen flex bg-white/50 global-bg gap-2 p-2">
      {/* Main Test Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            {/* Question Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-300 border-2 border-black rounded-full mb-6 font-bold text-black uppercase">
              <BookOpen size={14} className="text-black" />
              <span className="text-xs font-black text-black">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-yellow-100 border-2 border-black rounded-full h-3 mb-8 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-yellow-400 border-r-2 border-black rounded-full"
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
                <h2 className="text-2xl font-black text-black uppercase">
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
                        className={`w-full p-4 text-left rounded-lg border-4 transition-all font-bold ${
                          answers[currentQuestion._id] === idx
                            ? 'border-black bg-yellow-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black'
                            : 'border-black bg-white hover:bg-yellow-50 text-black'
                        }`}
                      >
                        <span className="font-bold uppercase">{option}</span>
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
                    className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all placeholder:text-black/50 uppercase"
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
                        className={`flex-1 p-4 font-bold rounded-lg border-4 transition-all uppercase ${
                          answers[currentQuestion._id] === option.value
                            ? 'border-black bg-yellow-200 text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]'
                            : 'border-black bg-white text-black hover:bg-yellow-50'
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
                    <p className="text-sm text-black font-bold uppercase">
                      Language:{' '}
                      <span className="text-black font-black">
                        {currentQuestion.codeLanguage || 'JavaScript'}
                      </span>
                    </p>
                    {currentQuestion.starterCode && (
                      <div className="bg-yellow-50 p-4 rounded-lg border-2 border-black">
                        <p className="text-xs text-black mb-2 font-bold uppercase">
                          STARTER CODE:
                        </p>
                        <pre className="text-xs text-black overflow-x-auto font-mono bg-white border border-black p-2 rounded">
                          {currentQuestion.starterCode}
                        </pre>
                      </div>
                    )}
                    <textarea
                      placeholder="Write your code here..."
                      value={answers[currentQuestion._id] || ''}
                      onChange={(e) => onAnswerChange(e.target.value)}
                      className="w-full h-48 px-4 py-3 bg-white border-2 border-black rounded-lg text-black font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSubmitAnswer}
                  disabled={submitted}
                  className="w-full mt-8 px-6 py-3 bg-yellow-300 text-black font-black rounded-lg border-4 border-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] disabled:shadow-none"
                >
                  <Send size={18} />
                  {submitted ? 'SUBMITTED...' : 'SUBMIT ANSWER'}
                </motion.button>

                {submitted && (
                  <p className="text-center text-sm text-black font-bold uppercase animate-pulse">
                    ✓ Answer submitted. Loading next question...
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="w-80 bg-white border-l-4 border-black p-6 overflow-y-auto shadow-[-4px_0px_0px_rgba(0,0,0,1)]">
        <div className="sticky top-0 bg-white pb-4 mb-4 border-b-4 border-black">
          <h3 className="text-lg font-black text-black uppercase">
            📊 LIVE LEADERBOARD
          </h3>
          <p className="text-xs text-black/50 mt-1 font-bold uppercase">
            Real-time rankings
          </p>
        </div>

        <div className="space-y-2">
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all border-2 border-black font-bold ${
                  i === 0
                    ? 'bg-yellow-300 shadow-[4px_4px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-yellow-50'
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border border-black ${
                      i === 0
                        ? 'bg-yellow-200 text-black'
                        : 'bg-white text-black border-2 border-black'
                    }`}
                  >
                    {i === 0 && '🥇'}
                    {i === 1 && '🥈'}
                    {i === 2 && '🥉'}
                    {i > 2 && i + 1}
                  </div>
                  <span className="text-sm font-black text-black truncate uppercase">
                    {entry.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-black ${
                    i === 0
                      ? 'text-black bg-white px-2 py-1 rounded border border-black'
                      : 'text-black'
                  }`}
                >
                  {entry.score} PTS
                </span>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-sm text-black/50 font-bold uppercase">
                Waiting for first submissions...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
