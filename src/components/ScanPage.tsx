import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from './Camera';
import { ImageUpload } from './ImageUpload';
import { RockResult } from './RockResult';
import { Camera as CameraIcon, UploadCloud, ArrowLeft, Sun, Moon } from 'lucide-react';
import { analyzeRock } from '../lib/gemini';
import { useTheme } from '../contexts/ThemeContext';

type Mode = 'camera' | 'upload';

interface RockAnalysis {
  name: string;
  composition: string;
  hardness: string;
  locations: string[];
  description: string;
  type?: string;
  texture?: string;
  color?: string;
  density?: string;
  porosity?: string;
  fossilContent?: string;
  weatheringResistance?: string;
  formationProcess?: string;
  geologicalAge?: string;
  uses?: string[];
}

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [mode, setMode] = useState<Mode>('camera');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RockAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Request camera permission when mode is 'camera'
    if (mode === 'camera') {
      const requestInitialPermission = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err) {
          console.error('Initial camera permission error:', err);
        }
      };
      
      requestInitialPermission();
    }
  }, [mode]);

  const handleAnalysis = async (imageData: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeRock(imageData);
      if (result.name === "Analysis Error") {
        setError(result.description);
      }
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async (imageSrc: string) => {
    setImage(imageSrc);
    await handleAnalysis(imageSrc);
  };

  const handleUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result as string;
      setImage(imageData);
      await handleAnalysis(imageData);
    };
    reader.readAsDataURL(file);
  };

  const resetScan = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f4ed] dark:bg-[#080a09] text-gray-900 dark:text-[#e3ddd7]">
      <header className="bg-white/90 dark:bg-[#080a09]/90 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-[#4a4a4a] dark:text-[#e3ddd7] hover:text-[#4a4a4a]/80 dark:hover:text-[#e3ddd7]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-[#4a4a4a] dark:text-[#e3ddd7]">RockScan Pro</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          {!image && (
            <>
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={() => setMode('camera')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    mode === 'camera'
                      ? 'bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80 text-white dark:text-[#080a09]'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#080a09] dark:text-[#e3ddd7] dark:hover:bg-gray-800'
                  }`}
                >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Camera
                </button>
                <button
                  onClick={() => setMode('upload')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    mode === 'upload'
                      ? 'bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80 text-white dark:text-[#080a09]'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#080a09] dark:text-[#e3ddd7] dark:hover:bg-gray-800'
                  }`}
                >
                  <UploadCloud className="w-5 h-5 mr-2" />
                  Upload
                </button>
              </div>

              {mode === 'camera' ? (
                <Camera onCapture={handleCapture} />
              ) : (
                <ImageUpload onUpload={handleUpload} />
              )}
            </>
          )}

          {image && (
            <div className="space-y-8">
              <RockResult
                image={image}
                properties={analysis}
                loading={loading}
                isDark={isDark}
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-2 px-4 bg-gray-200 text-[#4a4a4a] dark:bg-gray-800 dark:text-[#e3ddd7] rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </button>
                <button
                  onClick={resetScan}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80 text-white dark:text-[#080a09] rounded-lg hover:from-[#4a4a4a]/90 hover:to-[#4a4a4a]/70 dark:hover:from-[#e3ddd7]/90 dark:hover:to-[#e3ddd7]/70 transition-colors"
                >
                  Scan Another Rock
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};