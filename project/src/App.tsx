// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Examples from './components/Examples';
import Pricing from './components/Pricing';
import ChatPage from './pages/ChatPage';
import VisionPage from './pages/VisionPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <HowItWorks />
              <Examples />
              <Pricing />
            </>
          } />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/vision" element={<VisionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;