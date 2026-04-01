import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Send, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { connectSocket, emitSubmitAnswer, onLeaderboardUpdate, onSessionEnded, getSocket } from '../../services/socket';
import { getQuestionsBySphere } from '../../services/api';

export default function LiveTestPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  useEffect(() => {
    const setupTest = async () => {
      try {
        setLoading(true);
        // Fetch questions
        const questionsData = await getQuestionsBySphere(id);
        setQuestions(questionsData);

        // Connect socket if not already connected
        if (token && !getSocket()) {
          connectSocket(token);
        }

        // Listen for leaderboard updates
        onLeaderboardUpdate((data) => {
          console.log('📊 Leaderboard updated:', data);
          if (data.rankings) {
            setLeaderboard(data.rankings);
          }
        });

        // Listen for session end
        onSessionEnded((data) => {
          console.log('✅ Session ended:', data);
          setSessionEnded(true);
        });
      } catch (err) {
        console.error('Failed to load test:', err);
      } finally {
        setLoading(false);
      }
    };

    setupTest();
  }, [id, token]);

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

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion._id]: value,
    });
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    const answer = answers[currentQuestion._id];
    if (answer === undefined || answer === '') {
      alert('Please provide an answer');
      return;
    }

    // Emit answer to socket
    emitSubmitAnswer({
      sphereId: id,
      questionId: currentQuestion._id,
      answer,
      userId: user._id,
    });

    setSubmitted(true);

    // Move to next question or end test
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSubmitted(false);
      } else {
        setSessionEnded(true);
      }
    }, 1000);
  };

  if (sessionEnded) {
    return (
      <div className="w-full h-full p-8 bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-black text-[#e2e8f0] mb-2">Test Complete!</h2>
          <p className="text-[#64748b] mb-8">Thanks for participating!</p>

          {/* Final Leaderboard */}
          <div className="bg-[#13131f] border border-[#1e1e2f] rounded-xl p-6">
            <h3 className="text-lg font-black text-[#e2e8f0] mb-4">Final Rankings</h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#0a0a0f] rounded">
                  <span className="text-[#e2e8f0] font-bold">#{idx + 1} {entry.name}</span>
                  <span className="text-[#6366f1] font-bold">{entry.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-[#0a0a0f]">
      {/* Main Test Area */}
      <div className="flex-1 p-8">
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
                animate={{
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
                className="h-full bg-[#6366f1] rounded-full"
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
                <h2 className="text-2xl font-black text-[#e2e8f0]">
                  {currentQuestion.questionText}
                </h2>

                {/* Question Type: MCQ */}
                {currentQuestion.type === 'MCQ' && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleAnswerChange(idx)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          answers[currentQuestion._id] === idx
                            ? 'border-[#6366f1] bg-[#6366f1]/20'
                            : 'border-[#1e1e2f] bg-[#0a0a0f] hover:border-[#6366f1]/50'
                        }`}
                      >
                        <span className="font-semibold text-[#e2e8f0]">{option}</span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Question Type: TEXT */}
                {currentQuestion.type === 'TEXT' && (
                  <input
                    type="text"
                    placeholder="Enter your answer..."
                    value={answers[currentQuestion._id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#1e1e2f] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-[#6366f1]"
                  />
                )}

                {/* Question Type: BOOL */}
                {currentQuestion.type === 'BOOL' && (
                  <div className="flex gap-4">
                    {[
                      { label: 'True', value: true },
                      { label: 'False', value: false },
                    ].map((option) => (
                      <motion.button
                        key={option.label}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleAnswerChange(option.value)}
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
                    <p className="text-sm text-[#64748b]">Language: {currentQuestion.codeLanguage}</p>
                    {currentQuestion.starterCode && (
                      <div className="bg-[#0a0a0f] p-4 rounded-lg border border-[#1e1e2f]">
                        <pre className="text-xs text-[#6366f1] overflow-x-auto">
                          {currentQuestion.starterCode}
                        </pre>
                      </div>
                    )}
                    <textarea
                      placeholder="Write your code here..."
                      value={answers[currentQuestion._id] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="w-full h-48 px-4 py-3 bg-[#0a0a0f] border border-[#1e1e2f] rounded-lg text-[#e2e8f0] font-mono text-sm focus:outline-none focus:border-[#6366f1]"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitAnswer}
                  disabled={submitted}
                  className="w-full mt-8 px-6 py-3 bg-[#6366f1] text-white font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {submitted ? 'Submitted...' : 'Submit Answer'}
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="w-80 bg-[#0f0f1a] border-l border-[#1e1e2f] p-6 overflow-y-auto">
        <h3 className="text-lg font-black text-[#e2e8f0] mb-4">Live Leaderboard</h3>
        <div className="space-y-2">
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-[#13131f] rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#64748b]">#{i + 1}</span>
                  <div className="w-8 h-8 bg-[#6366f1] rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <span className="text-sm font-semibold text-[#e2e8f0] truncate">
                    {entry.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#6366f1]">{entry.score} pts</span>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-[#64748b]">Waiting for answers...</p>
          )}
        </div>
      </div>
    </div>
  );
}
