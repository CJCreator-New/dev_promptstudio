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

      intro.oncomplete(async () => {
        await completeOnboarding();
        setShowCompletion(true);
        logger.info('Onboarding Completed');
      });

      intro.onexit(async () => {
        // If they exit early, we still mark as seen so we don't annoy them
        await completeOnboarding(); 
        logger.info('Onboarding Exited/Skipped');
      });

      // Start the tour
      setTimeout(() => intro.start(), 500);
    } else {
      // Intro.js not loaded - skip tour gracefully
      completeOnboarding();
      logger.info('Onboarding skipped - Intro.js not available');
    }
  };

  const handleSkip = async () => {
    setShowWelcome(false);
    await completeOnboarding();
    logger.info('Onboarding Skipped from Modal');
  };

  const completeOnboarding = async () => {
    localStorage.setItem('devprompt_has_onboarded', 'true');
    
    // Send notification to admin
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      try {
        const formData = new FormData();
        formData.append('_subject', '[NEW USER] DevPrompt Studio Onboarding Complete');
        formData.append('User Email', userEmail);
        formData.append('Timestamp', new Date().toISOString());
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');
        
        await fetch('https://formsubmit.co/cjsaran94@gmail.com', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
      } catch (error) {
        console.error('Failed to send onboarding notification:', error);
      }
    }
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