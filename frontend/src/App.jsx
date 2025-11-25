import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/index.jsx';
import Login from './pages/login/index.jsx';
import Join from './pages/Joinsphere/index.jsx';
const App = () => {
  return (
    <div className="min-h-screen font-serif text-black bg-[#FFFDF0]">
      <BrowserRouter>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/join" element={<Join />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
