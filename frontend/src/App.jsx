import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './pages/landing/index.jsx';
import Login from './pages/login/index.jsx';
import Join from './pages/Joinsphere/index.jsx';
import Create from './pages/Createsphere/index.jsx';
import Selectquestions from './pages/Selectquestions/index.jsx';
import Dashboard from './pages/dashboard/index.jsx';
import { selectAuth } from './store/store';
function ProtectedRoute({ children }) {
  const auth = useSelector(selectAuth);
  const isAuthed = Boolean(auth?.token);

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AuthRoute({ children }) {
  const auth = useSelector(selectAuth);
  const isAuthed = Boolean(auth?.token);

  if (isAuthed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

const App = () => {
  return (
    <div className="min-h-screen font-serif text-black bg-[#FFFDF0]">
      <BrowserRouter>

        {/* Header visible on all pages */}


        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={(
              <AuthRoute>
                <Login />
              </AuthRoute>
            )}
          />
          <Route
            path="/join"
            element={(
              <ProtectedRoute>
                <Join />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/create"
            element={(
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/questions"
            element={(
              <ProtectedRoute>
                <Selectquestions />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
        </Routes>

      </BrowserRouter>
    </div>
  );
};

export default App;
