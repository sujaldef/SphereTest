import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/index.jsx';
import Login from './pages/login/index.jsx';
import Join from './pages/Joinsphere/index.jsx';
import Create from './pages/Createsphere/index.jsx';
import Header from './pages/landing/components/Header.jsx'; // FIXED
import Selectquestions from './pages/Selectquestions/index.jsx';
const App = () => {
  return (
    <div className="min-h-screen font-serif text-black bg-[#FFFDF0]">
      <BrowserRouter>

        {/* Header visible on all pages */}
        

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/create" element={<Create />} />
          <Route path="/questions" element={<Selectquestions />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
};

export default App;
