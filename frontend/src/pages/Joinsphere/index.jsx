import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getSphereByCode,
  joinSphere,
  registerUser,
  loginUser,
} from '../../services/api';
import JoinSphereUI from './UI';

/**
 * JoinSpherePage - Logic Layer
 *
 * PURPOSE:
 *   - Handle sphere code entry and validation
 *   - Manage user registration/login flow
 *   - Join sphere API integration
 *   - Detect late joins and redirect to test page
 *   - Enforce admin role separation
 *
 * FLOW:
 *   1. User enters game code (code step)
 *   2. If not authenticated: register/login (register step)
 *   3. Join sphere API call
 *   4. If session ACTIVE: redirect to test page (new tab)
 *   5. If session UPCOMING: redirect to lobby
 *
 * APIs USED:
 *   - getSphereByCode: Fetch sphere by code
 *   - joinSphere: Add user to participants
 *   - registerUser: Create account
 *   - loginUser: Authenticate existing user
 *
 * STATE MANAGED:
 *   - step: Current UI step (code/register/joining/ready)
 *   - gameCode: User-entered sphere code
 *   - sphere: Fetched sphere details
 *   - joinedSphere: Sphere after join (contains sessionStatus)
 *   - registerData: Form fields (name, email, password)
 *   - loading: API call status
 *   - error: Error messages
 *
 * CRITICAL RULES:
 *   - Admin cannot join own sphere (403 block)
 *   - Late joiners (sessionStatus === ACTIVE) open test in NEW TAB
 *   - Early joiners redirect to lobby
 *   - Use window.open() for test, NOT navigate()
 */

export default function JoinSphere() {
  const navigate = useNavigate();
  const { token, login, user } = useAuth();

  // UI Flow State
  const [step, setStep] = useState('code');

  // Form State
  const [gameCode, setGameCode] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Data State
  const [sphere, setSphere] = useState(null);
  const [joinedSphere, setJoinedSphere] = useState(null);

  // UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cleanup effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Demo placeholder
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle sphere code submission
   * - Fetch sphere by code
   * - Check if admin trying to join own sphere
   * - If authenticated: directly join
   * - If not: show registration form
   */
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (gameCode.trim().length < 6) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const details = await getSphereByCode(gameCode.trim());
      setSphere(details);

      // 🔒 ADMIN CHECK: Prevent admin from joining own sphere
      if (user && details.createdBy._id === user._id) {
        setError(
          'You created this sphere - admins cannot join as participants. Go to My Spheres to manage it.',
        );
        setLoading(false);
        return;
      }

      // If already authenticated, skip registration and join directly
      if (token) {
        setStep('joining');
        await performJoin(details.gameCode);
      } else {
        // Need to register/login first
        setStep('register');
      }
    } catch (apiError) {
      const errorMessage =
        apiError?.message || 'Invalid code. Please check and try again.';
      setError(errorMessage);
      console.error('Code lookup error:', apiError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle registration and join
   * - Attempt user registration
   * - If user exists: login instead
   * - Then join sphere
   */
  const handleRegisterAndJoin = async () => {
    if (!sphere) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      let accessToken = token;

      if (!accessToken) {
        try {
          const registered = await registerUser(registerData);
          accessToken = registered.token;
        } catch (registerErr) {
          if (
            registerErr?.status === 409 ||
            registerErr?.originalError?.response?.status === 409
          ) {
            // User already exists, try login
            try {
              const loggedIn = await loginUser({
                email: registerData.email,
                password: registerData.password,
              });
              accessToken = loggedIn.token;
            } catch (loginErr) {
              throw new Error(loginErr?.message || 'Invalid login credentials');
            }
          } else {
            throw registerErr;
          }
        }

        await login(accessToken);
      }

      await performJoin(sphere.gameCode);
    } catch (apiError) {
      const errorMessage =
        apiError?.message || 'Unable to join sphere. Please try again.';
      setError(errorMessage);
      console.error('Join sphere error:', apiError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Core join operation
   * - Call joinSphere API
   * - Check sessionStatus
   * - Redirect if ACTIVE (late join) → window.open()
   * - Redirect if UPCOMING → /lobby
   */
  const performJoin = async (code) => {
    try {
      setStep('joining');
      const result = await joinSphere({ gameCode: code });
      setJoinedSphere(result);

      // ✅ LATE JOIN CHECK: If session already active, redirect to test
      if (result.sessionStatus === 'ACTIVE') {
        console.log('🟢 Late join detected - opening test in new tab...');
        // CRITICAL: Use window.open() for test page (new tab)
        window.open(`/dashboard/sphere/${result._id}/test`, '_blank');
        return;
      }

      // Otherwise redirect to lobby (session is UPCOMING or DRAFT)
      setStep('ready');
      navigate(`/dashboard/sphere/${result._id}/lobby`);
    } catch (err) {
      setError(err?.message || 'Failed to join sphere');
      setStep(token ? 'code' : 'register');
    }
  };

  // Props to pass to UI component
  const uiProps = {
    step,
    setStep,
    gameCode,
    setGameCode,
    registerData,
    setRegisterData,
    error,
    loading,
    sphere,
    joinedSphere,
    onCodeSubmit: handleCodeSubmit,
    onRegisterAndJoin: handleRegisterAndJoin,
  };

  return <JoinSphereUI {...uiProps} />;
}
