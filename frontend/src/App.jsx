import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/index.jsx';
import Login from './pages/login/index.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './pages/Dashboard/DashboardLayout.jsx';
import DashboardHome from './pages/Dashboard/DashboardHome.jsx';
import DashboardCreatePage from './pages/Dashboard/DashboardCreatePage.jsx';
import DashboardJoinPage from './pages/Dashboard/DashboardJoinPage.jsx';
import DashboardQuestionPage from './pages/Dashboard/DashboardQuestionPage.jsx';
import MySpheresPage from './pages/Dashboard/MySpheresPage.jsx';
import JoinedSpheresPage from './pages/Dashboard/JoinedSpheresPage.jsx';
import LeaderboardPage from './pages/Dashboard/LeaderboardPage.jsx';
import SphereAnalyticsPage from './pages/Dashboard/SphereAnalyticsPage.jsx';
import SphereLobbyPage from './pages/Dashboard/SphereLobbyPage.jsx';
import LiveTestPage from './pages/Dashboard/LiveTestPage.jsx';

const App = () => {
  return (
    <div className="min-h-screen font-sans">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="create" element={<DashboardCreatePage />} />
            <Route path="join" element={<DashboardJoinPage />} />
            <Route path="my-spheres" element={<MySpheresPage />} />
            <Route path="joined" element={<JoinedSpheresPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
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
