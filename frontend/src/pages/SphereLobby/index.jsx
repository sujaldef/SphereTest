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
 * APIs USED:
 *   - getSphereById: Fetch full sphere data
 *
 * SOCKETS USED:
 *   - connectSocket: Establish connection
 *   - onSessionStarted: Listen for start event
 *   - join_sphere: Register for real-time updates
 *
 * STATE MANAGED:
 *   - sphere: Full sphere details
 *   - participants: Current participant count
 *   - countdownSeconds: Time until auto-start
 *   - joiningActive: Late join in progress
 *   - autoStarting: Session starting
 *   - loading: Initial load state
 *   - error: Error message
 *
 * ADMIN ONLY:
 *   - canStartSession: Admin can click to start
 *   - Sees "Start Session" button only
 *
 * STUDENT ONLY:
 *   - Sees countdown until start
 *   - Waits for admin to start
 *   - Redirected to test when active
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

        // Connect socket
        if (token && !getSocket()) {
          connectSocket(token);
        }

        // Listen for session start event
        onSessionStarted((data) => {
          console.log('🎬 Session started:', data);
          // Open test in new tab instead of navigate
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
  }, [id, token, navigate]);

  // Auto-start countdown logic
  useEffect(() => {
    if (!sphere) return;

    // Only show countdown for UPCOMING sessions
    if (
      sphere.sessionStatus === 'UPCOMING' ||
      sphere.sessionStatus === 'DRAFT'
    ) {
      const secondsUntilStart = getSecondsUntilAutoStart(sphere);
      if (secondsUntilStart !== null && secondsUntilStart > 0) {
        setCountdownSeconds(secondsUntilStart);

        // Update countdown every second
        const checkInterval = setInterval(() => {
          setCountdownSeconds((prev) => {
            if (prev <= 1) {
              console.log('⏰ Session start time reached');
              clearInterval(checkInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(checkInterval);
      }
    }
  }, [sphere]);

  // Late join detection: Redirect if session already active
  useEffect(() => {
    if (!sphere || joiningActive) return;

    // 🔐 SECURITY: Admin cannot access test as participant
    if (isAdmin) {
      console.log('🔐 Admin detected - blocking participant flow');
      return;
    }

    // Check if session is already active (late join)
    if (isSessionAlreadyActive(sphere)) {
      console.log('🟢 Session already active, joining as late participant...');
      setJoiningActive(true);

      // Emit join_sphere to register in real-time room
      const socket = getSocket();
      if (socket) {
        socket.emit('join_sphere', id);
      }

      // Use window.open() to open test in new tab
      const redirectTimer = setTimeout(() => {
        window.open(`/dashboard/sphere/${id}/test`, '_blank');
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
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
