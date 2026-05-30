import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  connectSocket,
  onSessionStarted,
  getSocket,
} from '../../services/socket';
import { getSphereById } from '../../services/api';
import {
  getSecondsUntilAutoStart,
  isSessionAlreadyActive,
} from '../../utils/sessionStateHelper';
import SphereLobbyUI from './UI';

const LATE_JOIN_REDIRECT_DELAY = 1500; // ms - time before redirecting late joiners to test

/**
 * SphereLobbyPage - Logic Layer
 *
 * PURPOSE:
 *   - Load sphere data and display waiting room
 *   - Manage session countdown timer
 *   - Detect late joins and redirect to test
 *   - Handle admin starting session
 *   - Enforce admin role separation
 *
 * FLOW:
 *   1. Load sphere details
 *   2. Connect to socket (for real-time updates)
 *   3. Listen for session start event
 *   4. Show countdown if UPCOMING
 *   5. Show "waiting for admin" if DRAFT
 *   6. If late join (already ACTIVE): redirect to test
 *
 * ADMIN: Sees "Start Session" button only
 * STUDENT: Sees countdown until start, redirected when active
 */

export default function SphereLobbyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Data State
  const [sphere, setSphere] = useState(null);
  const [participants, setParticipants] = useState(0);

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState(null);
  const [autoStarting, setAutoStarting] = useState(false);
  const [joiningActive, setJoiningActive] = useState(false);

  // Derived state
  const isAdmin = sphere?.createdBy?._id === user?._id;

  // Load sphere and setup socket
  useEffect(() => {
    const setupLobby = async () => {
      try {
        setLoading(true);
        const sphereData = await getSphereById(id);
        setSphere(sphereData);
        setParticipants(sphereData.participants?.length || 0);

        // Connect socket if not already connected
        if (token && !getSocket()) {
          connectSocket(token);
        }

        // Listen for session start event
        onSessionStarted(() => {
          window.open(`/dashboard/sphere/${id}/test`, '_blank');
        });
      } catch (err) {
        setError('Failed to load lobby');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    setupLobby();
  }, [id, token]);

  // Auto-start countdown logic - only for UPCOMING sessions
  useEffect(() => {
    if (sphere?.sessionStatus !== 'UPCOMING') return;

    const secondsUntilStart = getSecondsUntilAutoStart(sphere);
    if (secondsUntilStart === null || secondsUntilStart <= 0) return;

    setCountdownSeconds(secondsUntilStart);

    // Update countdown every second
    const checkInterval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(checkInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [sphere]);

  // Late join detection: Redirect if session already active
  useEffect(() => {
    if (!sphere || joiningActive || isAdmin) return;

    // Check if session is already active (late join)
    if (!isSessionAlreadyActive(sphere)) return;

    setJoiningActive(true);

    // Register in real-time room
    const socket = getSocket();
    if (socket) {
      socket.emit('join_sphere', id);
    }

    // Redirect to test in new tab
    const redirectTimer = setTimeout(() => {
      window.open(`/dashboard/sphere/${id}/test`, '_blank');
    }, LATE_JOIN_REDIRECT_DELAY);

    return () => clearTimeout(redirectTimer);
  }, [sphere, joiningActive, id, isAdmin]);

  // Admin start session handler
  const handleStartSession = () => {
    const socket = getSocket();
    if (socket) {
      setAutoStarting(true);
      socket.emit('start_session', { sphereId: id, startTime: new Date() });
    }
  };

  // Props for UI component
  const uiProps = {
    loading,
    error,
    sphere,
    participants,
    countdownSeconds,
    joiningActive,
    autoStarting,
    isAdmin,
    onStartSession: handleStartSession,
    onReturnDashboard: () => navigate('/dashboard'),
  };

  return <SphereLobbyUI {...uiProps} />;
}
