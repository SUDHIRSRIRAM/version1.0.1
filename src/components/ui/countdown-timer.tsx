import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  isRunning: boolean;
}

export const CountdownTimer = ({ initialSeconds, onComplete, isRunning }: CountdownTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!isRunning) {
      setSeconds(initialSeconds);
      return;
    }

    if (seconds === 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, isRunning, initialSeconds, onComplete]);

  // Calculate progress percentage
  const progress = (seconds / initialSeconds) * 100;
  
  // Get color based on progress
  const getColor = () => {
    if (progress <= 25) return '#EF4444'; // Red
    if (progress <= 50) return '#F59E0B'; // Orange
    return '#3B82F6'; // Blue
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-4"
    >
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="12"
            className="drop-shadow-sm"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 58}`}
            strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: `${2 * Math.PI * 58 * (1 - progress / 100)}` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="drop-shadow-md"
          />
        </svg>
        
        {/* Timer text with glow effect */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className={cn(
            "text-4xl font-bold tracking-tight",
            "bg-clip-text text-transparent bg-gradient-to-b",
            progress <= 25 
              ? "from-red-500 to-red-600"
              : progress <= 50
                ? "from-orange-500 to-orange-600"
                : "from-blue-500 to-blue-600",
            "filter drop-shadow-sm"
          )}>
            {seconds}
          </span>
        </motion.div>
      </div>

      {/* Status text */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-sm font-medium text-gray-600">
          Processing Image
        </p>
        <p className={cn(
          "text-xs font-semibold mt-1",
          progress <= 25 ? "text-red-500" : 
          progress <= 50 ? "text-orange-500" : 
          "text-blue-500"
        )}>
          {Math.round(progress)}% Complete
        </p>
      </motion.div>
    </motion.div>
  );
};
