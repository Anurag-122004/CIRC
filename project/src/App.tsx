import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatPage from './pages/ChatPage';
import VisionPage from './pages/VisionPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/vision" element={<VisionPage />} />
        </Routes>
      </div>
    </Router>
  );
}