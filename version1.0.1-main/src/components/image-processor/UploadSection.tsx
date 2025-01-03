import React, { useCallback, useRef, memo, useState } from 'react';
import { Button } from "../ui/button";

interface UploadSectionProps {
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onUpload: (file: File) => void;
}

export const UploadSection = memo(({ onDrop, onUpload }: UploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      onUpload(file);
    }
  }, [onUpload]);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      onUpload(file);
    }
    e.target.value = '';
  }, [onUpload]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh] flex items-center justify-center">
      <div
        ref={dropZoneRef}
        className={`
          w-full max-w-4xl min-h-[500px] rounded-3xl 
          ${isDragging 
            ? 'border-4 border-dashed border-blue-500 bg-blue-50/30' 
            : 'border-3 border-dashed border-gray-300 bg-gray-50/50'
          }
          p-12 text-center transition-all duration-300 ease-in-out 
          hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer group
          relative overflow-hidden
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleFileSelect();
          }
        }}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 animate-gradient"></div>
        
        <div className="relative flex flex-col items-center justify-center space-y-8">
          {/* Upload Icon with Animation */}
          <div className="w-32 h-32 rounded-3xl bg-white/80 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 transform-gpu">
            <svg
              className="w-16 h-16 text-blue-500 group-hover:text-blue-600 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Upload Text with Animation */}
          <div className="space-y-4 transform-gpu transition-all duration-300 group-hover:scale-105">
            <h3 className="text-3xl font-bold text-gray-700 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Drag & Drop your image here
            </h3>
            <p className="text-xl text-gray-500">or</p>
          </div>

          {/* Modern Upload Button */}
          <Button
            type="button"
            className="h-16 px-12 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                     hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform 
                     hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                     shadow-lg hover:shadow-2xl group-hover:translate-y-1"
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect();
            }}
          >
            Choose File
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="Upload image"
          />

          {/* Supported Formats with Animation */}
          <div className="transform-gpu transition-all duration-300 group-hover:translate-y-1">
            <p className="text-sm text-gray-400">
              Supported formats: PNG, JPG, JPEG, WEBP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});