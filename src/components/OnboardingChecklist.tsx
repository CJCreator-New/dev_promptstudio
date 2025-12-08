import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useOnboardingStore } from '../store/onboardingStore';

export const OnboardingChecklist: React.FC = () => {
  const { isComplete, isDismissed, steps, dismiss, checkStepCompletion } = useOnboardingStore();
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-check step completion on mount and periodically
  useEffect(() => {
    checkStepCompletion();
    const interval = setInterval(checkStepCompletion, 3000);
    return () => clearInterval(interval);
  }, [checkStepCompletion]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
      if (e.key === 'm' && e.ctrlKey) setIsMinimized(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dismiss]);

  if (isDismissed || isComplete) return null;

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
      role="complementary"
      aria-label="Onboarding checklist"
      aria-live="polite"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <h3 className="text-white font-semibold text-sm">Getting Started</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isMinimized ? 'Expand checklist' : 'Minimize checklist'}
            aria-expanded={!isMinimized}
            title={`${isMinimized ? 'Expand' : 'Minimize'} (Ctrl+M)`}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={dismiss}
            className="text-white/80 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Dismiss onboarding checklist"
            title="Dismiss (Esc)"
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
              <span aria-live="polite">{completedCount} of {steps.length} completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div 
              className="h-2 bg-slate-800 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Onboarding progress"
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="p-4 space-y-3" role="list">
            {steps.map((step, index) => {
              const isCompleted = step.completed;
              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                    isCompleted
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                  role="listitem"
                  aria-label={`Step ${index + 1}: ${step.title} - ${isCompleted ? 'Completed' : 'Not completed'}`}
                >
                  <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${
                      isCompleted ? 'text-green-300' : 'text-slate-200'
                    }`}>
                      {step.title}
                      {isCompleted && <span className="sr-only"> (Completed)</span>}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4">
            <button
              onClick={dismiss}
              className="w-full text-xs text-slate-400 hover:text-slate-300 transition-colors py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Skip onboarding tour"
            >
              Skip tour
            </button>
          </div>
        </>
      )}
    </div>
  );
};
