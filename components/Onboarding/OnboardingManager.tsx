import React, { useState, useEffect } from 'react';
import { WelcomeModal, CompletionModal } from './OnboardingComponents';
import { TOUR_STEPS } from '../../utils/tourConfig';
import { logger } from '../../utils/errorLogging';

interface OnboardingManagerProps {
  isBooting: boolean;
}

export const OnboardingManager: React.FC<OnboardingManagerProps> = ({ isBooting }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (isBooting) return;

    // Check if user has seen onboarding
    const hasOnboarded = localStorage.getItem('devprompt_has_onboarded');
    if (!hasOnboarded) {
      // Small delay to ensure UI is settled
      const timer = setTimeout(() => {
        setShowWelcome(true);
        logger.info('Onboarding Started');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isBooting]);

  const handleStartTour = () => {
    setShowWelcome(false);
    
    // Initialize Intro.js
    if ((window as any).introJs) {
      const intro = (window as any).introJs();
      
      intro.setOptions({
        steps: TOUR_STEPS,
        showProgress: true,
        showBullets: false,
        exitOnOverlayClick: false,
        disableInteraction: true,
        nextLabel: 'Next',
        prevLabel: 'Back',
        doneLabel: 'Finish'
      });

      intro.oncomplete(() => {
        completeOnboarding();
        setShowCompletion(true);
        logger.info('Onboarding Completed');
      });

      intro.onexit(() => {
        // If they exit early, we still mark as seen so we don't annoy them
        completeOnboarding(); 
        logger.info('Onboarding Exited/Skipped');
      });

      // Start the tour
      setTimeout(() => intro.start(), 500);
    } else {
      console.error('Intro.js not loaded');
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    setShowWelcome(false);
    completeOnboarding();
    logger.info('Onboarding Skipped from Modal');
  };

  const completeOnboarding = () => {
    localStorage.setItem('devprompt_has_onboarded', 'true');
  };

  return (
    <>
      <WelcomeModal 
        isOpen={showWelcome} 
        onStartTour={handleStartTour} 
        onSkip={handleSkip} 
      />
      <CompletionModal 
        isOpen={showCompletion} 
        onClose={() => setShowCompletion(false)} 
      />
    </>
  );
};