import { useState, useEffect } from 'react';

interface OnboardingState {
  isComplete: boolean;
  currentStep: string | null;
  dismissedTooltips: string[];
  userData: Record<string, any>;
}

const STORAGE_KEY = 'onboarding_state';

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        isComplete: false,
        currentStep: null,
        dismissedTooltips: [],
        userData: {}
      };
    } catch {
      return {
        isComplete: false,
        currentStep: null,
        dismissedTooltips: [],
        userData: {}
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeOnboarding = (userData: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      isComplete: true,
      userData: { ...prev.userData, ...userData }
    }));
  };

  const skipOnboarding = () => {
    setState(prev => ({ ...prev, isComplete: true }));
  };

  const dismissTooltip = (tooltipId: string) => {
    setState(prev => ({
      ...prev,
      dismissedTooltips: [...prev.dismissedTooltips, tooltipId]
    }));
  };

  const shouldShowTooltip = (tooltipId: string) => {
    return !state.dismissedTooltips.includes(tooltipId);
  };

  const resetOnboarding = () => {
    setState({
      isComplete: false,
      currentStep: null,
      dismissedTooltips: [],
      userData: {}
    });
  };

  return {
    isComplete: state.isComplete,
    userData: state.userData,
    completeOnboarding,
    skipOnboarding,
    dismissTooltip,
    shouldShowTooltip,
    resetOnboarding
  };
};
