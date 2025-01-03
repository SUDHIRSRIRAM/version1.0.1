import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  onComplete?: () => void;
}

export const LoadingSpinner = ({ onComplete }: LoadingSpinnerProps) => {
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="bg-white/90 rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="space-y-6 text-center relative z-10">
          <div className="w-16 h-16 mx-auto">
            <svg
              className="animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Removing Background
          </h2>
          <div className="relative pt-1">
            <div className="flex items-center justify-center">
              <div className="text-lg font-semibold text-blue-600">
                {countdown}s
              </div>
            </div>
            <div className="overflow-hidden h-2 mt-4 text-xs flex rounded-full bg-blue-100">
              <div
                style={{ width: `${(countdown / 20) * 100}%` }}
                className="animate-pulse shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 ease-out rounded-full"
              ></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50"></div>
      </div>
    </div>
  );
};
