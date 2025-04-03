import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Menu,
  X,
  Scan,
  Database,
  Share2,
  Github,
  Twitter,
  Linkedin,
  ChevronDown,
  MessageSquare,
  Book
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Quick Scan', path: '/scan', icon: <Scan className="h-4 w-4 mr-2" /> },
    { name: 'Rock Chat', path: '/rock-chat', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    // { name: 'Your Gallery', path: '/your-gallery', icon: <Database className="h-4 w-4 mr-2" /> },
    { name: 'About Us', path: '/about-us', icon: <Github className="h-4 w-4 mr-2" /> },
    { name: 'Contact Us', path: '/contact-us', icon: <Share2 className="h-4 w-4 mr-2" /> }
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-[#f5f4ed] dark:bg-[#080a09] text-gray-900 dark:text-[#e3ddd7] transition-colors duration-300">
        {/* Navbar */}
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-[#080a09]/80 backdrop-blur-md py-2' : 'bg-transparent py-4'
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* RockDown Dropdown (Left) */}
              <div className="hidden md:flex items-center">
                <div className="relative group">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}

                    className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r 
                      ${isDark
                        ? 'from-[#e3ddd7]/20 to-[#e3ddd7]/40 text-[#e3ddd7]'
                        : 'from-[#4a4a4a]/20 to-[#4a4a4a]/40 text-[#4a4a4a]'
                      } hover:opacity-90 transition-all shadow-md`}
                  >
                    <Menu className="h-5 w-5" />
                    <span className="font-medium">RockDown</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#080a09] rounded-xl shadow-lg py-2 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 transition-all duration-200 border border-gray-200 dark:border-gray-800">
                      {menuItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.path}
                          className="flex items-center w-full text-left px-4 py-3 text-sm dark:text-[#e3ddd7] text-[#4a4a4a] hover:bg-gradient-to-r hover:from-[#4a4a4a]/10 hover:to-[#4a4a4a]/20 dark:hover:from-[#e3ddd7]/10 dark:hover:to-[#e3ddd7]/20 transition-all focus:outline-none"
                        >
                          {item.icon}
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Logo (Center) */}
              <div className="flex-1 flex justify-center">
                <a href="/" className="flex items-center">
                  <span className={`font-bold transition-all duration-300 ${isScrolled ? 'text-3xl' : 'text-5xl'
                    }`}>
                    GeoScanPRO
                  </span>
                </a>
              </div>

              {/* Theme Toggle and Rock Chat (Right) */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => navigate('/rock-chat')}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80 text-white dark:text-[#080a09] hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Rock Chat
                  </div>
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="Menu"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/90 dark:bg-[#080a09]/90 backdrop-blur-md mt-2 rounded-b-xl shadow-lg">
              <div className="px-3 pt-2 pb-3 space-y-1">
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center px-4 py-3 rounded-full text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {isDark ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className="flex items-center px-4 py-3 rounded-full text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1525857597365-5f6dbff2e36e?auto=format&fit=crop&q=80"
              alt="Rock formation background"
              className="w-full h-full object-cover opacity-20 dark:opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f5f4ed]/30 to-[#f5f4ed] dark:from-[#080a09]/30 dark:to-[#080a09]"></div>
          </div>

          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#4a4a4a] dark:text-[#e3ddd7] mb-6 leading-tight">
              Discover the World of Rocks
            </h1>
            <p className="text-xl sm:text-2xl text-[#4a4a4a]/80 dark:text-[#e3ddd7]/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Instantly identify and learn about rocks and minerals using our advanced AI technology.
              Perfect for geologists, students, and rock enthusiasts.
            </p>
            <div className="flex flex-col items-center space-y-5">
              <button
                onClick={() => navigate('/scan')}
                className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80 text-white dark:text-[#080a09] hover:from-[#4a4a4a]/90 hover:to-[#4a4a4a]/70 dark:hover:from-[#e3ddd7]/90 dark:hover:to-[#e3ddd7]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center">
                  <Scan className="h-5 w-5 mr-2" />
                  Quick Scan Your Rock
                </div>
              </button>

              <button
                onClick={() => navigate('/rock-chat')}
                className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-[#6a6a6a] to-[#6a6a6a]/80 dark:from-[#c3c3c3] dark:to-[#c3c3c3]/80 text-white dark:text-[#080a09] hover:from-[#6a6a6a]/90 hover:to-[#6a6a6a]/70 dark:hover:from-[#c3c3c3]/90 dark:hover:to-[#c3c3c3]/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Quick Chat Your Rock
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-[#f5f4ed] dark:bg-[#080a09]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#4a4a4a] dark:text-[#e3ddd7] mb-16">
              Advanced Geological Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Scan className="h-10 w-10" />,
                  title: "Instant Scanning",
                  description: "Get immediate identification and detailed analysis of any rock or mineral"
                },
                {
                  icon: <Database className="h-10 w-10" />,
                  title: "Comprehensive Database",
                  description: "Access our extensive library of relevent geological information."
                },
                {
                  icon: <Book className="h-10 w-10" />,
                  title: "Rock Library",
                  description: "A quick rock library on the go, no need to cram"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="relative group p-8 bg-white/80 dark:bg-[#111211]/80 rounded-xl shadow-lg backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-800/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4a4a4a]/5 to-transparent dark:from-[#e3ddd7]/5 dark:to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="text-[#4a4a4a] dark:text-[#e3ddd7] mb-6 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-center text-[#4a4a4a] dark:text-[#e3ddd7]">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-[#080a09] mb-6">
              Ready to Explore the World of Rocks?
            </h2>
            <p className="text-xl text-white/90 dark:text-[#080a09]/90 mb-10 max-w-3xl mx-auto">
              Chat with RockChat AI to identify rocks, understand their properties, and uncover geological secrets instantly.
            </p>
            <button
              onClick={() => navigate('/rock-chat')}
              className="px-8 py-4 bg-white text-[#4a4a4a] dark:bg-[#080a09] dark:text-[#e3ddd7] rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Rock Chat
              </div>
            </button>
          </div>
        </div>




        {/* Footer */}
        <footer className="bg-white/10 dark:bg-[#111211]/30 backdrop-blur-sm py-4 border-t border-gray-200/20 dark:border-gray-800/20">
          <div className="max-w-4xl mx-auto text-center text-xs text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} GeoScan Pro. All rights reserved.
          </div>
        </footer>


      </div>
    </div>
  );
};

// This component is missing from the imports but used in the button
const Download = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);