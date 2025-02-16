import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, UserProfile } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Examples from "./components/Examples";
import Pricing from "./components/Pricing";
import ChatPage from "./pages/ChatPage";
import VisionPage from "./pages/VisionPage";
import ScrollToSection from "./components/ScrollToSection"; // Import ScrollToSection
import FreeTrialAuth from "./pages/FreeTrialAuth";

// Function to protect routes
function ProtectedRoute({ children }: { children: JSX.Element }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" />
      <ScrollToSection /> {/* Automatically scrolls to the section if needed */}
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <HowItWorks />
              <Examples />
              <Pricing />
            </>
          } />

          {/* Protected Routes */}
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/vision" element={<ProtectedRoute><VisionPage /></ProtectedRoute>} />
          {/* Other Routes */}
          <Route path="/free-trial-auth" element={<ProtectedRoute><FreeTrialAuth /></ProtectedRoute>} />

          {/* Clerk User Profile Page */}
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
