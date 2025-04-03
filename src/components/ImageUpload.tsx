import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-md mx-auto p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-lg text-gray-600">
        {isDragActive
          ? "Drop the image here"
          : "Drag & drop an image here, or click to select"}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Supports JPG, PNG, and WebP
      </p>
    </div>
  );
};