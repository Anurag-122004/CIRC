// import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesBackground } from './SparklesBackground';

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Sparkles Background */}
      <SparklesBackground
        particleColor="#8B5CF6"
        particleCount={150}
        minSize={0.8}
        maxSize={1.6}
        speed={0.6}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Transform Your Research with{' '}
          <span className="gradient-text">AI Power</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
          Upload your images and let our AI transform them into engaging thoughts,
          articles,and visual content.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/vision" className="primary-button">
          Visualize Now
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