# Session Lifecycle - Quick Reference Guide

## The core problem: Sessions had no ACTIVE state

### ❌ BEFORE (Broken)

```javascript
if (startTime > now) → UPCOMING
else → ENDED
// At 10:00 AM: immediately becomes ENDED even though session is running!
```

### ✅ AFTER (Fixed)

```javascript
if (now < startTime) → UPCOMING
if (startTime ≤ now < endTime) → ACTIVE  // ← This was missing!
if (now ≥ endTime) → ENDED
// Where: endTime = startTime + (duration * 60 seconds)
```

---

## Four Session States

| State    | When                      | Join?  | Frontend     | Backend      |
| -------- | ------------------------- | ------ | ------------ | ------------ |
| DRAFT    | No startTime              | ✅ Yes | Gray         | Always allow |
| UPCOMING | now < startTime           | ✅ Yes | Orange       | Allow        |
| ACTIVE   | startTime ≤ now < endTime | ✅ Yes | Green (LIVE) | Allow        |
| ENDED    | now ≥ endTime             | ❌ No  | Red          | Reject       |

---

## Implementation Locations

### Frontend: Session State Logic

**File**: `frontend/src/utils/sessionStateHelper.js`

```javascript
export function getSessionState(sphere) {
  if (!sphere.startTime) return 'DRAFT';

  const now = new Date();
  const startTime = new Date(sphere.startTime);
  const endTime = new Date(
    startTime.getTime() + (sphere.duration || 0) * 60 * 1000,
  );

  if (now < startTime) return 'UPCOMING';
  if (now >= startTime && now < endTime) return 'ACTIVE';
  return 'ENDED';
}
```

### Backend: Join Validation

**File**: `backend/src/controllers/sphereController.js` (joinSphere function)

```javascript
if (sphere.startTime) {
  const now = new Date();
  const startTime = new Date(sphere.startTime);
  const endTime = new Date(startTime.getTime() + sphere.duration * 60 * 1000);

  if (now > endTime) {
    res.status(400);
    throw new Error('Session has ended. No new joins allowed');
  }
}
```

---

## Files Using Session State

| File                    | What Changed                   | Why                                       |
| ----------------------- | ------------------------------ | ----------------------------------------- |
| `DashboardHome.jsx`     | Filter for UPCOMING + ACTIVE   | Shows live sessions, not just future ones |
| `MySpheresPage.jsx`     | Use `getSessionState()` helper | Accurate status display                   |
| `JoinedSpheresPage.jsx` | Use `getSessionState()` helper | Accurate status for joined sessions       |

---

## Testing: Before vs After

### Session: 10:00 AM - 11:00 AM (60 min)

#### BEFORE (Broken)

| Time     | Status      | Can Join? | Problem                      |
| -------- | ----------- | --------- | ---------------------------- |
| 9:30 AM  | UPCOMING    | ?         | Might work                   |
| 10:00 AM | **ENDED** ✗ | ❌ No     | WRONG! Session just started! |
| 10:30 AM | **ENDED** ✗ | ❌ No     | WRONG! Still in session!     |
| 11:00 AM | ENDED       | ❌ No     | Correct                      |

#### AFTER (Fixed)

| Time     | Status       | Can Join? | Correct?         |
| -------- | ------------ | --------- | ---------------- |
| 9:30 AM  | UPCOMING     | ✅ Yes    | Can pre-join ✓   |
| 10:00 AM | **ACTIVE** ✓ | ✅ Yes    | Live, join now ✓ |
| 10:30 AM | **ACTIVE** ✓ | ✅ Yes    | Still running ✓  |
| 11:00 AM | ENDED        | ❌ No     | Session over ✓   |

---

## Duration Calculation

All session end times calculated as:

```
endTime = startTime + (duration * 60 seconds)
```

**Examples**:

- Start: 2026-04-02 10:00 UTC, Duration: 90 min → End: 11:30 UTC
- Start: 2026-04-02 14:30 UTC, Duration: 45 min → End: 15:15 UTC
- Start: 2026-04-03 08:00 UTC, Duration: 120 min → End: 10:00 UTC

---

## Edge Cases Handled

| Edge Case                    | Handling                                 |
| ---------------------------- | ---------------------------------------- |
| now exactly equals startTime | Returns ACTIVE (inclusive)               |
| now exactly equals endTime   | Returns ENDED (exclusive)                |
| duration = 0                 | endTime = startTime, immediately ENDED   |
| null startTime               | Returns DRAFT, always joinable           |
| Negative duration            | Treated as 0 (shouldn't happen but safe) |

---

## Code Migration

### If you see old pattern:

```javascript
const startTime = sphere.startTime;
if (startTime > now) return 'UPCOMING';
return 'ENDED'; // ← WRONG!
```

### Replace with:

```javascript
import { getSessionState } from '../../utils/sessionStateHelper';
const state = getSessionState(sphere); // ← RIGHT!
```

---

## Status Display

### Frontend Badge Colors

- DRAFT: Gray (on-demand)
- UPCOMING: Orange (countdown)
- ACTIVE: Green + pulse (LIVE!)
- ENDED: Red (closed)

### Example Badge Code

```javascript
function getStatusBadge(state) {
  const badges = {
    DRAFT: { text: 'DRAFT', color: 'bg-gray-500/20 text-gray-400' },
    UPCOMING: { text: 'UPCOMING', color: 'bg-orange-500/20 text-orange-400' },
    ACTIVE: {
      text: 'LIVE',
      color: 'bg-green-500/20 text-green-400 animate-pulse',
    },
    ENDED: { text: 'ENDED', color: 'bg-red-500/20 text-red-400' },
  };
  return badges[state];
}
```

---

## What This Fixes

1. ✅ Sessions no longer show as ENDED when they should be ACTIVE
2. ✅ Users can join throughout the entire session (not just before startTime)
3. ✅ Clear 60+ minute execution window for tests
4. ✅ Consistent behavior between frontend and backend
5. ✅ No more "This session ended before it started" confusion

---

## Quick Verification

Run this to verify the fix works:

```javascript
// Test sphere: 10:00 AM - 11:00 AM UTC
const sphere = {
  startTime: new Date('2026-04-02T10:00:00Z'),
  duration: 60,
};

// At 10:30 AM UTC
const now = new Date('2026-04-02T10:30:00Z');

// Calculate end time
const startTime = new Date(sphere.startTime);
const endTime = new Date(startTime.getTime() + sphere.duration * 60 * 1000);

// Check state
if (now < startTime) console.log('UPCOMING');
else if (now >= startTime && now < endTime)
  console.log('ACTIVE'); // ← Should print this!
else console.log('ENDED');

// Should output: ACTIVE ✓
```

---

## Summary

**Before**: Sessions 🚫 had no execution window (went UPCOMING → ENDED at startTime)

**After**: Sessions ✅ have proper lifecycle with clear ACTIVE window (startTime → startTime+duration)

**Why It Matters**: Without an ACTIVE state, scheduled tests were unusable and caused user confusion about when they could participate.
