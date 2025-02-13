import React from 'react';
import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Background dots pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-20">
          {[...Array(200)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-gray-500 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Transform Your Research with{' '}
          <span className="gradient-text">AI Power</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
          Upload your research papers and let our AI transform them into engaging presentations,
          podcasts, and visual content.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/vision" className="primary-button">
          Analyze..
          </Link>
          <button className="secondary-button">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;