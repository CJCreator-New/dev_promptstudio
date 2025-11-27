import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

// --- Base Shimmer Skeleton ---
interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden bg-slate-800/50 rounded ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-700/20 to-transparent" />
    </div>
  );
};

// --- Inline Spinner ---
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={`rounded-full border-slate-400/30 border-t-white animate-spin-smooth ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
      style={{ willChange: 'transform' }}
    />
  );
};

// --- Progress Bar ---
interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-medium text-indigo-300">{label}</span>
          <span className="text-xs font-mono text-slate-400">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// --- Thinking Steps (Granular Feedback) ---
const STEPS = [
  "Analyzing Input Context",
  "Identifying Constraints",
  "Optimizing for Target Tool",
  "Structuring Output",
  "Refining Details"
];

export const ThinkingSteps: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500); // Advance step every 1.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xs mx-auto space-y-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
      <div className="flex items-center gap-2 mb-2 text-purple-300 font-semibold text-xs uppercase tracking-wider">
        <Loader2 className="w-3 h-3 animate-spin" />
        AI Reasoning Process
      </div>
      <div className="space-y-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step} className={`flex items-center gap-3 text-sm transition-colors duration-300 ${isCurrent ? 'text-white font-medium' : isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : isCurrent ? (
                <div className="w-4 h-4 flex items-center justify-center">
                   <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-slate-700" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};