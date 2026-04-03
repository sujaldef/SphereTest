/**
 * Session State Lifecycle Helper
 * Determines the current state of a sphere session based on startTime, duration, and current time
 *
 * States:
 * - DRAFT: No startTime set (on-demand, always-open session)
 * - UPCOMING: startTime is in future (session not yet started)
 * - ACTIVE: Current time is between startTime and endTime (session is running)
 * - ENDED: Current time is after endTime (session has completed)
 */

/**
 * Get the current state of a sphere's session
 * @param {Object} sphere - Sphere object with startTime and duration
 * @returns {string} One of: 'DRAFT', 'UPCOMING', 'ACTIVE', 'ENDED'
 */
export function getSessionState(sphere) {
  // DRAFT: No start time means on-demand session
  if (!sphere.startTime) {
    return 'DRAFT';
  }

  const now = new Date();
  const startTime = new Date(sphere.startTime);

  // Determine endTime: explicit endTime takes priority over duration
  let endTime;
  if (sphere.endTime) {
    // Use explicit endTime if provided (from new feature)
    endTime = new Date(sphere.endTime);
  } else {
    // Fall back to duration-based calculation
    endTime = new Date(
      startTime.getTime() + (sphere.duration || 0) * 60 * 1000,
    );
  }

  // UPCOMING: Session hasn't started yet
  if (now < startTime) {
    return 'UPCOMING';
  }

  // ACTIVE: Current time is between start and end (inclusive start, exclusive end)
  if (now >= startTime && now < endTime) {
    return 'ACTIVE';
  }

  // ENDED: Session has ended
  return 'ENDED';
}

/**
 * Get status badge styling for a session state
 * @param {string} state - Session state from getSessionState()
 * @returns {Object} {text, color} for display
 */
export function getStatusBadge(state) {
  const badges = {
    DRAFT: { text: 'DRAFT', color: 'bg-gray-500/20 text-gray-400' },
    UPCOMING: { text: 'UPCOMING', color: 'bg-orange-500/20 text-orange-400' },
    ACTIVE: {
      text: 'LIVE',
      color: 'bg-green-500/20 text-green-400 animate-pulse',
    },
    ENDED: { text: 'ENDED', color: 'bg-red-500/20 text-red-400' },
  };
  return badges[state] || badges.DRAFT;
}

/**
 * Get remaining time until session start or end
 * @param {Object} sphere - Sphere object with startTime and duration
 * @returns {Object} {type: 'until_start'|'until_end'|'completed', minutes: number}
 */
export function getTimeRemaining(sphere) {
  if (!sphere.startTime) {
    return { type: 'on_demand', minutes: null };
  }

  const now = new Date();
  const startTime = new Date(sphere.startTime);

  // Determine endTime: explicit endTime takes priority
  let endTime;
  if (sphere.endTime) {
    endTime = new Date(sphere.endTime);
  } else {
    endTime = new Date(
      startTime.getTime() + (sphere.duration || 0) * 60 * 1000,
    );
  }

  if (now < startTime) {
    const minutesUntilStart = Math.ceil((startTime - now) / 60000);
    return { type: 'until_start', minutes: minutesUntilStart };
  }

  if (now < endTime) {
    const minutesUntilEnd = Math.ceil((endTime - now) / 60000);
    return { type: 'until_end', minutes: minutesUntilEnd };
  }

  return { type: 'completed', minutes: 0 };
}

/**
 * Check if a user can join a sphere
 * @param {Object} sphere - Sphere object
 * @param {string} userId - Current user ID (optional)
 * @returns {Object} {canJoin: boolean, reason: string}
 */
export function canJoinSphere(sphere, userId) {
  // Check if user is creator (if userId provided)
  if (userId && sphere.createdBy === userId) {
    return { canJoin: false, reason: 'You are the creator of this sphere' };
  }

  // Check if already joined (if userId provided)
  if (
    userId &&
    sphere.participants &&
    sphere.participants.some((p) => p.userId === userId)
  ) {
    return { canJoin: false, reason: 'Already joined' };
  }

  const state = getSessionState(sphere);

  switch (state) {
    case 'DRAFT':
      return { canJoin: true, reason: 'On-demand session' };
    case 'UPCOMING':
      return { canJoin: true, reason: 'Can pre-join before session starts' };
    case 'ACTIVE':
      return { canJoin: true, reason: 'Session is live, join now' };
    case 'ENDED':
      return { canJoin: false, reason: 'Session has ended' };
    default:
      return { canJoin: false, reason: 'Unknown session state' };
  }
}

/**
 * Format session timing info for display
 * @param {Object} sphere - Sphere object
 * @returns {string} Human-readable session timing
 */
export function formatSessionTiming(sphere) {
  if (!sphere.startTime) {
    return 'On-demand session';
  }

  const startTime = new Date(sphere.startTime);

  // Determine endTime: explicit endTime takes priority
  let endTime;
  if (sphere.endTime) {
    endTime = new Date(sphere.endTime);
  } else {
    endTime = new Date(
      startTime.getTime() + (sphere.duration || 0) * 60 * 1000,
    );
  }

  const startStr = startTime.toLocaleString();
  const endStr = endTime.toLocaleTimeString();

  return `${startStr} - ${endStr}`;
}

/**
 * Check if session should auto-start based on scheduled time
 * @param {Object} sphere - Sphere object with startTime and actualStartTime
 * @returns {boolean} True if current time >= startTime AND session hasn't actually started
 */
export function shouldAutoStartSession(sphere) {
  // Only auto-start scheduled sessions
  if (!sphere.startTime) {
    return false;
  }

  // If session already started, don't auto-start again
  if (sphere.actualStartTime) {
    return false;
  }

  // Check if current time has reached or passed startTime
  const now = new Date();
  const startTime = new Date(sphere.startTime);

  return now >= startTime;
}

/**
 * Get seconds until auto-start
 * @param {Object} sphere - Sphere object with startTime
 * @returns {number} Seconds until startTime (negative if already started)
 */
export function getSecondsUntilAutoStart(sphere) {
  if (!sphere.startTime) {
    return null;
  }

  const now = new Date();
  const startTime = new Date(sphere.startTime);
  const secondsUntil = Math.ceil((startTime - now) / 1000);

  return Math.max(0, secondsUntil);
}

/**
 * Check if session is already active (late join scenario)
 * @param {Object} sphere - Sphere object
 * @returns {boolean} True if session is ACTIVE and has already started
 */
export function isSessionAlreadyActive(sphere) {
  if (!sphere.startTime) {
    return false; // On-demand sessions never "start"
  }

  // Session is active if:
  // 1. actualStartTime is set (session was started)
  // 2. OR current time >= startTime (session time has arrived)
  const now = new Date();
  const startTime = new Date(sphere.startTime);

  if (sphere.actualStartTime) {
    return true; // Already started (admin clicked or auto-started)
  }

  if (now >= startTime) {
    return true; // Start time has been reached
  }

  return false;
}
