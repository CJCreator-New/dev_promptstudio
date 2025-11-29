import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useOnboardingStore } from '../store/onboardingStore';
import confetti from 'canvas-confetti';

export const OnboardingChecklist: React.FC = () => {
  const { steps, currentStep, isComplete, isDismissed, completeStep, dismiss, checkStepCompletion } = useOnboardingStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Check completion status on mount and periodically
    checkStepCompletion();
    const interval = setInterval(checkStepCompletion, 2000);
    return () => clearInterval(interval);
  }, [checkStepCompletion]);

  useEffect(() => {
    // Trigger confetti when complete
    if (isComplete && !showCelebration) {
      setShowCelebration(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [isComplete, showCelebration]);

  if (isDismissed || isComplete) return null;

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <h3 className="text-white font-semibold text-sm">Getting Started</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={dismiss}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Progress Bar */}
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{completedCount} of {steps.length} completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="p-4 space-y-3">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  step.completed
                    ? 'bg-green-500/10 border border-green-500/20'
                    : idx === currentStep
                    ? 'bg-indigo-500/10 border border-indigo-500/20'
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-medium ${
                    step.completed ? 'text-green-300' : 'text-slate-200'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4">
            <button
              onClick={dismiss}
              className="w-full text-xs text-slate-400 hover:text-slate-300 transition-colors py-2"
            >
              Skip tour
            </button>
          </div>
        </>
      )}
    </div>
  );
};
