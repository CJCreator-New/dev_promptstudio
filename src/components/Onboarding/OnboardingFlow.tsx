import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  visual?: string;
  content: React.ReactNode;
}

interface OnboardingFlowProps {
  steps: OnboardingStep[];
  onComplete: (data: Record<string, any>) => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ steps, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Record<string, any>>({});

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete(userData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => setCurrentStep(prev => Math.max(0, prev - 1));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-elevated rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    idx <= currentStep ? 'bg-accent-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <button
            onClick={onSkip}
            className="ml-4 text-muted hover:text-foreground transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
          <p className="text-muted mb-6">{steps[currentStep].description}</p>
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-hover transition-colors font-medium"
          >
            {isLastStep ? (
              <>
                Complete <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
