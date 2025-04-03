import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Send, ArrowLeft, Sun, Moon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRockInfo, getDetailedRockInfo } from '../lib/rockChat';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isStructured?: boolean;
  rockDetails?: Record<string, string>;
}

const RockChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentRock, setCurrentRock] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const rockName = query.trim();
    setCurrentRock(rockName);
    setLoading(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: rockName,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([userMessage]);

    try {
      // Get narrative information about the rock
      const rockInfo = await getRockInfo(rockName);
      
      // Get structured data for the rock properties
      const rockDetails = await getDetailedRockInfo(rockName);
      
      // Clean up any asterisks that might be in the text
      const cleanedRockInfo = rockInfo.replace(/\*/g, '');
      
      // Add AI response with structured data
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: cleanedRockInfo,
        sender: 'ai',
        timestamp: new Date(),
        isStructured: true,
        rockDetails: rockDetails
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching rock information:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I couldn't retrieve information about that rock. Please try again or ask about a different rock.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handleFollowUpQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !currentRock) return;

    setLoading(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // For follow-up questions, include the rock name for context
      const enhancedQuery = `Regarding ${currentRock}: ${query}`;
      const response = await getRockInfo(enhancedQuery);
      
      // Clean up any asterisks that might be in the text
      const cleanedResponse = response.replace(/\*/g, '');
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: cleanedResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching follow-up information:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I couldn't process your question. Please try asking in a different way.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentRock(null);
    setQuery('');
    inputRef.current?.focus();
  };

  // Helper function to render structured rock data
  const renderRockDetails = (details: Record<string, string>) => {
    // Define the display order for properties
    const propertyOrder = [
      "type", "mineralComposition", "texture", "color", "hardness", 
      "density", "porosityPermeability", "fossilContent", "weatheringResistance", 
      "formationProcess", "geologicalAge", "location", "uses"
    ];
    
    // Map of property keys to display names
    const propertyNames: Record<string, string> = {
      "type": "Type",
      "mineralComposition": "Mineral Composition",
      "texture": "Texture",
      "color": "Color",
      "hardness": "Hardness",
      "density": "Density",
      "porosityPermeability": "Porosity & Permeability",
      "fossilContent": "Fossil Content",
      "weatheringResistance": "Weathering & Erosion Resistance",
      "formationProcess": "Formation Process",
      "geologicalAge": "Geological Age",
      "location": "Location & Occurrence",
      "uses": "Uses"
    };
    
    return (
      <div className="bg-white/90 dark:bg-[#111211]/90 rounded-lg shadow-md p-4 mt-4 space-y-3 text-sm">
        <h3 className="font-semibold text-base border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
          Rock Properties
        </h3>
        
        {propertyOrder.map(key => (
          details[key] && (
            <div key={key} className="grid grid-cols-3 gap-2">
              <div className="font-medium text-gray-600 dark:text-gray-300">
                {propertyNames[key] || key}:
              </div>
              <div className="col-span-2 text-[#4a4a4a] dark:text-[#e3ddd7]">
                {details[key]}
              </div>
            </div>
          )
        ))}
      </div>
    );
  };

  // Function to parse the narrative content for display
  const renderNarrativeContent = (content: string) => {
    // Split the content by the double line breaks to identify paragraphs
    const paragraphs = content.split(/\n\n+/);
    
    // If it's a structured response with Type: etc. format, we'll render differently
    if (content.includes('Type:') && content.includes('Mineral Composition:')) {
      // For simpler display, we'll skip rendering the structured part since we have a better UI for it
      // Just extract the last paragraph which is usually the narrative summary
      const lastParagraph = paragraphs[paragraphs.length - 1];
      return <p className="whitespace-pre-wrap">{lastParagraph}</p>;
    }
    
    // Otherwise, render the whole content normally
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <div className="min-h-screen bg-[#f5f4ed] dark:bg-[#080a09] text-[#4a4a4a] dark:text-[#e3ddd7] flex flex-col">
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
          <h1 className="text-2xl font-bold text-[#4a4a4a] dark:text-[#e3ddd7]">Rock Chat</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-[#4a4a4a] dark:text-[#e3ddd7]">
              Welcome to Rock Chat
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Search for any rock or mineral to learn about its properties, formation, and more.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7]" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Try searching for "Granite", "Basalt", "Limestone", "Marble", or any rock you're curious about.
              </p>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80 text-white dark:text-[#080a09]'
                        : 'bg-white/80 dark:bg-[#111211]/80 text-[#4a4a4a] dark:text-[#e3ddd7] shadow-md'
                    }`}
                  >
                    {message.sender === 'ai' && message.isStructured ? (
                      <>
                        {renderNarrativeContent(message.content)}
                        
                        {message.rockDetails && renderRockDetails(message.rockDetails)}
                      </>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-white/70 dark:text-[#080a09]/70'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Search Form */}
        <div className="sticky bottom-0 bg-[#f5f4ed] dark:bg-[#080a09] pt-4">
          <form 
            onSubmit={currentRock ? handleFollowUpQuestion : handleSearch}
            className="relative"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={currentRock ? `Ask more about ${currentRock}...` : "Search for a rock or mineral..."}
              className="w-full px-5 py-4 pr-16 bg-white/80 dark:bg-[#111211]/80 backdrop-blur-sm rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]/50 dark:focus:ring-[#e3ddd7]/50 text-[#4a4a4a] dark:text-[#e3ddd7] placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80 text-white dark:text-[#080a09] rounded-full hover:opacity-90 transition-all disabled:opacity-50"
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white dark:border-[#080a09] border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
              ) : currentRock ? (
                <Send className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </form>

          {/* Reset Button (only show if there are messages) */}
          {messages.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={resetChat}
                className="text-sm text-[#4a4a4a]/70 dark:text-[#e3ddd7]/70 hover:text-[#4a4a4a] dark:hover:text-[#e3ddd7] transition-colors"
              >
                Start a new search
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RockChatPage;