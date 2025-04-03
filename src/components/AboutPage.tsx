import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import teamImage from '/Users/garvitgupta/Downloads/GEOScanPro Final/src/assets/team-image.jpg';


const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const teamMembers = [
    {
      name: 'Garvit',
      role: 'Developer & Geophysicist',
      image: teamImage,
      description: 'Garvit is a developer and geophysicist with a passion for using technology to advance geological exploration.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f4ed] dark:bg-[#080a09] text-[#4a4a4a] dark:text-[#e3ddd7]">
      {/* Header */}
      <header className="bg-white/90 dark:bg-[#080a09]/90 shadow-sm backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={() => navigate('/')} 
            className="flex items-center text-[#4a4a4a] dark:text-[#e3ddd7] hover:text-[#4a4a4a]/80 dark:hover:text-[#e3ddd7]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-[#4a4a4a] dark:text-[#e3ddd7]">About Us</h1>
          <button
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Revolutionizing Rock Identification</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            GeoScan Pro combines cutting-edge AI technology with geological expertise to make rock identification 
            accessible to everyone, from professional geologists to curious enthusiasts.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="bg-white/80 dark:bg-[#111211]/80 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our mission is to bridge the gap between traditional geological expertise and modern technology, 
              making rock identification and analysis accessible to everyone through innovative AI solutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-[#f5f4ed]/50 dark:bg-[#080a09]/50 rounded-lg">
                <h4 className="font-semibold mb-2">Innovation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pushing the boundaries of AI technology in geological analysis
                </p>
              </div>
              <div className="p-4 bg-[#f5f4ed]/50 dark:bg-[#080a09]/50 rounded-lg">
                <h4 className="font-semibold mb-2">Accessibility</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Making geological knowledge available to everyone
                </p>
              </div>
              <div className="p-4 bg-[#f5f4ed]/50 dark:bg-[#080a09]/50 rounded-lg">
                <h4 className="font-semibold mb-2">Education</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fostering learning and understanding of Earth's minerals
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20 text-center">
          <h3 className="text-2xl font-bold mb-8">About me</h3>
          <div className="flex justify-center">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white/80 dark:bg-[#111211]/80 rounded-xl p-6 shadow-lg backdrop-blur-sm max-w-sm w-full"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-xl font-semibold text-center mb-2">{member.name}</h4>
                <p className="text-[#4a4a4a]/80 dark:text-[#e3ddd7]/80 text-center mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
