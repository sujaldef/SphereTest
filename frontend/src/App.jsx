import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/index.jsx';
import LoginPage from './pages/login/index.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './pages/Dashboard/DashboardLayout.jsx';

// Refactored Pages (with logic/UI separation)
import JoinSpherePage from './pages/JoinSphere/index.jsx';
import SphereLobbyPage from './pages/SphereLobby/index.jsx';
import LiveTestPage from './pages/LiveTest/index.jsx';
import CreateSpherePage from './pages/CreateSphere/index.jsx';

// Dashboard Pages (being refactored for logic/UI separation)
import DashboardHome from './pages/Dashboard/DashboardHome.jsx';
import DashboardQuestionPage from './pages/Dashboard/DashboardQuestionPage.jsx';
import JoinedSpheresPage from './pages/Dashboard/JoinedSpheresPage.jsx';
import LeaderboardPage from './pages/Dashboard/LeaderboardPage.jsx';
import SphereAnalyticsPage from './pages/Dashboard/SphereAnalyticsPage.jsx';
import MySpheresPage from './pages/Dashboard/MySpheresPage.jsx';

/**
 * App.jsx - Main Router Configuration
 *
 * ROUTING STRUCTURE:
 *
 * PUBLIC ROUTES:
 *   / → LandingPage
 *   /login → LoginPage
 *   /join → JoinSpherePage (public join flow by game code)
 *
 * PROTECTED ROUTES (under /dashboard):
 *   /dashboard → DashboardLayout (wrapper)
 *   /dashboard → DashboardHome (default)
 *   /dashboard/create → CreateSpherePage (create new sphere)
 *   /dashboard/my-spheres → MySpheresPage (admin view)
 *   /dashboard/joined → JoinedSpheresPage (student view)
 *   /dashboard/leaderboard → LeaderboardPage
 *   /dashboard/sphere/:id/questions → DashboardQuestionPage
 *   /dashboard/sphere/:id/lobby → SphereLobbyPage (waiting room)
 *   /dashboard/sphere/:id/test → LiveTestPage (TEST PAGE in new tab!)
 *   /dashboard/sphere/:id/analytics → SphereAnalyticsPage
 *
 * MIGRATION STATUS:
 *   ✅ JoinSphere → JoinSpherePage (index.jsx + UI.jsx) COMPLETE
 *   ✅ SphereLobby → SphereLobbyPage (index.jsx + UI.jsx) COMPLETE
 *   ✅ LiveTest → LiveTestPage (index.jsx + UI.jsx) COMPLETE
 *   ✅ CreateSphere → CreateSpherePage (index.jsx + UI.jsx) COMPLETE
 *   ⏳ Dashboard pages → Being refactored for consistency
 *
 * NOTES:
 *   - /join is now public (move from /dashboard/join)
 *   - Uses DashboardLayout wrapper for protected routes
 *   - Late joins and admin checks enforced at page logic level
 */

const App = () => {
  return (
    <div className="min-h-screen font-sans">
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* JOIN SPHERE - Public route for game code entry */}
          <Route path="/join" element={<JoinSpherePage />} />

          {/* PROTECTED DASHBOARD ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Home */}
            <Route index element={<DashboardHome />} />

            {/* Sphere Management */}
            <Route path="create" element={<CreateSpherePage />} />
            <Route path="my-spheres" element={<MySpheresPage />} />
            <Route path="joined" element={<JoinedSpheresPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />

            {/* Sphere Details */}
            <Route
              path="sphere/:id/questions"
              element={<DashboardQuestionPage />}
            />
            <Route path="sphere/:id/lobby" element={<SphereLobbyPage />} />
            <Route path="sphere/:id/test" element={<LiveTestPage />} />
            <Route
              path="sphere/:id/analytics"
              element={<SphereAnalyticsPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
