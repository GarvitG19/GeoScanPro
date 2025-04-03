import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera as CameraIcon, RefreshCw, Check, X } from 'lucide-react';

interface CameraProps {
  onCapture: (image: string) => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isActive, setIsActive] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  
  useEffect(() => {
    // Check for camera permissions
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode,
            // Add specific constraints for mobile
            width: { ideal: isMobile ? 1280 : 1920 },
            height: { ideal: isMobile ? 720 : 1080 }
          }
        });
        
        setHasPermission(true);
        
        // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error('Camera permission error:', err);
        setHasPermission(false);
      }
    };
    
    checkPermissions();
  }, [facingMode, isMobile]);

  const requestPermission = async () => {
    try {
      // For iOS Safari, we need to request permission with exact constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: isMobile ? 1280 : 1920 },
          height: { ideal: isMobile ? 720 : 1080 }
        }
      });
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (err) {
      console.error('Failed to get permission:', err);
      setHasPermission(false);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreviewImage(imageSrc);
    }
  }, []);

  const confirmCapture = useCallback(() => {
    if (previewImage) {
      setIsActive(false); // Stop the camera after confirming
      onCapture(previewImage);
    }
  }, [previewImage, onCapture]);

  const cancelCapture = useCallback(() => {
    setPreviewImage(null);
  }, []);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (!isActive) {
    return null;
  }

  if (hasPermission === false) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Camera Access Required</h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          We need access to your camera to scan rocks. Please allow camera access in your browser settings.
        </p>
        <button
          onClick={requestPermission}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Request Camera Access
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-lg bg-gray-200 dark:bg-gray-700 h-48 w-full mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {previewImage ? (
        <div className="relative">
          <img 
            src={previewImage} 
            alt="Preview" 
            className="w-full rounded-lg shadow-lg"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={cancelCapture}
              className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-red-600" />
            </button>
            <button
              onClick={confirmCapture}
              className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Check className="w-6 h-6 text-green-600" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode,
              width: { ideal: isMobile ? 1280 : 1920 },
              height: { ideal: isMobile ? 720 : 1080 }
            }}
            className="w-full rounded-lg shadow-lg"
            onUserMediaError={(err) => {
              console.error('Webcam error:', err);
              setHasPermission(false);
            }}
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={capture}
              className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <CameraIcon className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={toggleCamera}
              className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};