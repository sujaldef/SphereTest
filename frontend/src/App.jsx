import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/index.jsx";

const App = () => {
  return (
    <div className="min-h-screen font-serif text-black bg-cream">
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App;
