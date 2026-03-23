## API integration verification

This guide explains how to verify that the frontend is correctly communicating with the backend API at `http://localhost:5000/api`.

### Prerequisites

- Backend server is running on port 5000.
- Frontend (Vite) dev server is running on port 5173.
- Browser dev tools (Network tab) are open.

### Axios client (`services/apiClient.js`)

- Check that every API request uses the base URL `http://localhost:5000/api`.
- When logged in:
  - Confirm that the `Authorization: Bearer <JWT>` header is present on requests.
- On error responses:
  - Confirm error messages in Redux state match `response.data.message` from the backend if present.

### Auth endpoints

- **POST `/auth/login`**
  - Use the login form.
  - Expect:
    - Network request: `POST http://localhost:5000/api/auth/login`.
    - Response includes `token` and `user`.
    - `localStorage.spheretest_token` is set.
    - Redux `auth.token` and `auth.user` are updated.

- **POST `/auth/register`**
  - Use the registration flow and click `FINISH`.
  - Expect:
    - Network request: `POST /auth/register`.
    - New user is created and state updates accordingly.

### Sphere endpoints

- **POST `/spheres`**
  - Flow: Create Sphere → `OPEN STUDIO`.
  - Expect:
    - Request body includes title, type, duration, max players, and security flags.
    - Response is stored as `spheres.current`.

- **GET `/spheres/code/:code`**
  - Flow: Join Sphere → enter access code → `CONNECT`.
  - Expect:
    - Request to `/spheres/code/<code>`.
    - Response contains sphere metadata shown in Redux under `spheres.current`.

### Question endpoints

- **POST `/questions`**
  - Flow: Question Studio → add questions → `SAVE PROGRESS`.
  - Expect:
    - Request body includes `sphereId` and `questions` array.
    - Backend persists questions without validation errors.

Use a combination of the browser Network tab, Redux DevTools, and backend logs to confirm that requests, payloads, and responses all match the intended contract.

