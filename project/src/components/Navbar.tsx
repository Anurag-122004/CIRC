// import React from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-pink-500" />
            <span className="ml-2 text-xl font-bold">
              <Link to="/" className="nav-link">Research AI</Link> {/* Use Link component for routing */}
            </span>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How it Works</a>
              <a href="#examples" className="nav-link">Examples</a>
              <a href="#pricing" className="nav-link">Pricing</a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="nav-link">Sign In</button>
            {/* Use Link component for routing */}
            <Link to="/chat" className="primary-button">Get Started</Link> 
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;