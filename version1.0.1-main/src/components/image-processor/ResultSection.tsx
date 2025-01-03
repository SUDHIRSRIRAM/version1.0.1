import { useState, useCallback, memo } from 'react';
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { CountdownSpinner } from '../CountdownSpinner';

interface ResultSectionProps {
  originalImage: string;
  processedImage: string | null;
  onProcess: () => void;
  onDelete: () => void;
  onDownload: () => void;
  isProcessing: boolean;
}

export const ResultSection = memo(({
  originalImage,
  processedImage,
  onProcess,
  onDelete,
  onDownload,
  isProcessing,
}: ResultSectionProps) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleted(true);
    onDelete();
  }, [onDelete]);

  const handleProcess = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onProcess();
  }, [onProcess]);

  const handleDownload = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (processedImage) {
      onDownload();
    }
  }, [processedImage, onDownload]);

  if (isDeleted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Original Image */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Original Image
            </h3>
          </div>
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 hover-card glass-effect border border-gray-100/20 shadow-xl">
            {originalImage && !isDeleted && (
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-contain p-4 sm:p-6"
                loading="eager"
                decoding="async"
              />
            )}
          </div>
        </div>

        {/* Processed Image */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Processed Image
          </h3>
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 hover-card glass-effect border border-gray-100/20 shadow-xl">
            {processedImage ? (
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-full object-contain p-4 sm:p-6"
                loading="eager"
                decoding="async"
                style={{ imageRendering: 'high-quality' }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 backdrop-blur-sm">
                <div className="text-center">
                  {isProcessing ? (
                    <div className="relative w-52 h-52 mx-auto">
                      <CountdownSpinner duration={20} isProcessing={isProcessing} />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-white/80 shadow-lg flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  )}
                  <p className="text-lg text-gray-600 mt-4 font-medium">
                    {isProcessing ? 'Removing background...' : 'Click Process to remove background'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-lg z-40">
        <div className="container mx-auto flex flex-col sm:flex-row gap-3 sm:gap-6 justify-end items-stretch sm:items-center">
          {/* Delete button - Always enabled */}
          <Button 
            onClick={handleDelete}
            type="button"
            className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 text-base font-medium shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Image
          </Button>

          {/* Process button - Show if image not processed */}
          {!processedImage && (
            <Button 
              onClick={handleProcess}
              type="button"
              className={`inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-base font-medium shadow-lg hover:shadow-xl hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isProcessing ? 'opacity-75' : ''}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Image'
              )}
            </Button>
          )}
          
          {/* Download button - Show if image processed */}
          {processedImage && (
            <Button 
              onClick={handleDownload}
              type="button"
              className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-base font-medium shadow-lg hover:shadow-xl hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Download Result
            </Button>
          )}
        </div>
      </div>

      {/* Spacer for fixed buttons */}
      <div className="h-20 sm:h-24"></div>
    </div>
  );
});