import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface ProductTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({ steps, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.querySelector(steps[currentStep]?.target);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const placement = steps[currentStep].placement || 'bottom';

    let top = 0, left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - 120;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 320;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 10;
        break;
    }

    setPosition({ top, left });

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('tour-highlight');

    return () => target.classList.remove('tour-highlight');
  }, [currentStep, steps]);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onSkip} />
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-elevated border border-border rounded-lg shadow-2xl p-4 w-80"
        style={{ top: `${position.top}px`, left: `${position.left}px`, transform: 'translateX(-50%)' }}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold">{steps[currentStep]?.title}</h3>
          <button onClick={onSkip} className="text-muted hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-muted mb-4">{steps[currentStep]?.content}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-accent-primary text-white rounded-lg text-sm hover:bg-accent-primary-hover transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};
