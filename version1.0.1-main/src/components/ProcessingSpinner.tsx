import { useState, useEffect } from 'react';
import { Progress } from './ui/progress';

interface ProcessingSpinnerProps {
  onComplete?: () => void;
  progress?: number;
}

export const ProcessingSpinner = ({ onComplete, progress = 0 }: ProcessingSpinnerProps) => {
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [onComplete]);

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-black/5 rounded-lg backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold">Processing Image</h3>
          <p className="text-sm text-gray-500">Please wait {timeLeft} seconds</p>
        </div>
        
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute top-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-500">
            {progress}% complete
          </p>
        </div>
      </div>
    </div>
  );
};
