/**
 * LiveTestPage - LOGIC LAYER
 *
 * RESPONSIBILITY:
 *   - Fetch questions for sphere
 *   - Setup socket connection
 *   - Manage test state (current question, answers, leaderboard)
 *   - Handle answer submission
 *   - Listen for session events
 *   - Track test progress
 *
 * KEY FLOWS:
 *   1. Load: Fetch questions → Connect socket → Setup listeners
 *   2. Question Navigation: Show → Answer → Submit → Next/End
 *   3. Session End: Listen for event → Show results
 *
 * SOCKET EVENTS:
 *   - onLeaderboardUpdate: Real-time score updates
 *   - onSessionEnded: Test complete
 *
 * API CALLS:
 *   - getQuestionsBySphere(sphereId): Fetch all questions
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  connectSocket,
  emitSubmitAnswer,
  onLeaderboardUpdate,
  onSessionEnded,
  getSocket,
} from '../../services/socket';
import { getQuestionsBySphere } from '../../services/api';
import LiveTestUI from './UI.jsx';

export default function LiveTestPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [error, setError] = useState(null);

  // Initialize test setup
  useEffect(() => {
    const setupTest = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch questions for this sphere
        const questionsData = await getQuestionsBySphere(id);
        if (!questionsData || questionsData.length === 0) {
          setError('No questions found for this sphere');
          return;
        }
        setQuestions(questionsData);

        // 2. Connect socket if not already connected
        if (token && !getSocket()) {
          connectSocket(token);
        }

        // 3. Setup socket listeners for leaderboard updates
        onLeaderboardUpdate((data) => {
          console.log('📊 Leaderboard updated:', data);
          if (data.rankings) {
            setLeaderboard(data.rankings);
          }
        });

        // 4. Setup socket listener for session end
        onSessionEnded((data) => {
          console.log('✅ Session ended:', data);
          setSessionEnded(true);
        });
      } catch (err) {
        console.error('Failed to load test:', err);
        setError(err.message || 'Failed to load test');
      } finally {
        setLoading(false);
      }
    };

    setupTest();
  }, [id, token]);

  // Handle answer selection
  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion._id]: value,
    });
  };

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    const answer = answers[currentQuestion._id];
    if (answer === undefined || answer === '') {
      alert('Please provide an answer');
      return;
    }

    // Emit answer to server via socket
    try {
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
          // Last question - wait for session end from server
          // sessionEnded will be set via socket listener
        }
      }, 1000);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('Failed to submit answer');
    }
  };

  // Derived state
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  // Pass everything to UI component
  const uiProps = {
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
    onAnswerChange: handleAnswerChange,
    onSubmitAnswer: handleSubmitAnswer,
  };

  return <LiveTestUI {...uiProps} />;
}
