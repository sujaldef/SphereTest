## Redux slice testing guide

This document describes how to manually verify the main Redux slices using the running frontend and Redux DevTools.

### Auth slice (`features/auth/authSlice.js`)

- **loginThunk**
  - Trigger: Use the login form and submit valid credentials.
  - Expected actions:
    - `auth/login/pending`
    - `auth/login/fulfilled` with `{ user, token }` from the backend.
  - State effects:
    - `auth.status` goes `idle` → `loading` → `succeeded`.
    - `auth.user` and `auth.token` are populated.
    - `localStorage.spheretest_token` is set.

- **registerThunk**
  - Trigger: Complete the registration multi-step form and press `FINISH`.
  - Expected actions:
    - `auth/register/pending`
    - `auth/register/fulfilled` with new user (and optionally token).
  - State effects:
    - `auth.status` goes `idle` → `loading` → `succeeded`.
    - `auth.user` updated to the new user.

### Sphere slice (`features/spheres/sphereSlice.js`)

- **createSphereThunk**
  - Trigger: Complete the create sphere wizard and click `OPEN STUDIO`.
  - Expected actions:
    - `spheres/create/pending`
    - `spheres/create/fulfilled` with created sphere.
  - State effects:
    - `spheres.current` is set to the created sphere.
    - `spheres.list` gains the new sphere.

- **fetchSphereByCodeThunk**
  - Trigger: Enter a valid join code on the Join page and press `CONNECT`.
  - Expected actions:
    - `spheres/fetchByCode/pending`
    - `spheres/fetchByCode/fulfilled` with the matching sphere.
  - State effects:
    - `spheres.current` holds the joined sphere data.

### Question slice (`features/questions/questionSlice.js`)

- **createQuestionsThunk**
  - Trigger: From the Question Studio, add a few questions and click `SAVE PROGRESS`.
  - Expected actions:
    - `questions/create/pending`
    - `questions/create/fulfilled` on success.
  - State effects:
    - `questions.status` reflects loading and success.
    - Backend should persist questions for the current sphere.

Use the Redux DevTools extension to inspect action payloads and final state for each of these flows.

