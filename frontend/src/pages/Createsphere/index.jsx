/**
 * CreateSphere - LOGIC LAYER
 *
 * RESPONSIBILITY:
 *   - Manage multi-step form state
 *   - Handle API calls (createSphere)
 *   - Date/time conversions
 *   - Step navigation
 *   - Form validation
 *
 * FLOW:
 *   Step 1: Blueprint - Title, type selection
 *   Step 2: Mechanics - Duration, schedule, players
 *   Step 3: Security - Anti-cheat settings
 *   Step 4: Redirect - Setup complete, go to questions
 *   Step 5: Game Code - Show code, proceed to studio
 *
 * API CALLS:
 *   - createSphere: Create new test session
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSphere } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CreateSphereUI from './UI.jsx';

export default function CreateSpherePage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [sphereId, setSphereId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'mcq',
    startTime: '',
    endTime: '',
    duration: 60,
    maxPlayers: 50,
    difficulty: 'medium',
    security: { faceId: true, fullscreen: false, tabSwitchDetection: true },
  });

  const totalSteps = 5;

  // Step navigation
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Date formatting utilities
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // API call - Create sphere
  const handleCreateSphere = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      // Validate form data
      if (!formData.title.trim()) {
        setError('Please enter a sphere title');
        setSubmitting(false);
        return;
      }

      if (formData.startTime && formData.endTime) {
        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);
        if (end <= start) {
          setError('End time must be after start time');
          setSubmitting(false);
          return;
        }
      }

      // Create sphere via API
      const sphere = await createSphere({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        duration: Number(formData.duration),
        maxPlayers: Number(formData.maxPlayers),
        difficulty: formData.difficulty,
        security: formData.security,
      });

      // Store in localStorage for reference
      localStorage.setItem('latestGameCode', sphere.gameCode);
      localStorage.setItem('latestSphereId', sphere._id);

      // Update state
      setGameCode(sphere.gameCode);
      setSphereId(sphere._id);

      // Go to game code display step
      nextStep();
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || 'Failed to create sphere';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Navigate to question studio
  const handleProceedToQuestions = () => {
    navigate(`/dashboard/sphere/${sphereId}/questions`);
  };

  // Pass all state and handlers to UI
  const uiProps = {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    formData,
    setFormData,
    submitting,
    error,
    gameCode,
    onCreateSphere: handleCreateSphere,
    onProceedToQuestions: handleProceedToQuestions,
    formatDateForInput,
    formatTimeForInput,
  };

  return <CreateSphereUI {...uiProps} />;
}
