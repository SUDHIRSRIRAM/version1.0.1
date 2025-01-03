import React, { useEffect, useState } from 'react';
import './Spinner3D.css';

interface CountdownSpinnerProps {
  duration: number;
  isProcessing: boolean;
}

export const CountdownSpinner: React.FC<CountdownSpinnerProps> = ({ duration, isProcessing }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = ((duration - timeLeft) / duration) * 100;
  const circumference = 2 * Math.PI * 45; // For progress ring

  useEffect(() => {
    if (!isProcessing) {
      setTimeLeft(duration);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isProcessing, duration]);

  return (
    <div className="modern-spinner">
      {/* Animated rings */}
      <div className="spinner-ring ring-1"></div>
      <div className="spinner-ring ring-2"></div>
      <div className="spinner-ring ring-3"></div>

      {/* Floating particles */}
      <div className="particles">
        <div className="particle" style={{ top: '20%', left: '20%' }}></div>
        <div className="particle" style={{ top: '60%', left: '80%' }}></div>
        <div className="particle" style={{ top: '80%', left: '40%' }}></div>
      </div>

      {/* Countdown display */}
      <div className="countdown-container">
        <div className="countdown-number">{timeLeft}s</div>
        <div className="countdown-text">Processing...</div>
      </div>

      {/* Progress ring */}
      <svg className="progress-ring" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          opacity="0.2"
        />
        <circle
          className="text-blue-500"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * progress) / 100}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
      </svg>
    </div>
  );
};
