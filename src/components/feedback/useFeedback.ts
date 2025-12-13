import { useState, useEffect } from 'react';

interface FeedbackState {
  count: number;
  lastSubmitted: number | null;
  badges: string[];
  surveysDismissed: string[];
}

const STORAGE_KEY = 'feedback_state';

export const useFeedback = () => {
  const [state, setState] = useState<FeedbackState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        count: 0,
        lastSubmitted: null,
        badges: [],
        surveysDismissed: []
      };
    } catch {
      return {
        count: 0,
        lastSubmitted: null,
        badges: [],
        surveysDismissed: []
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const submitFeedback = (feedback: any) => {
    const newCount = state.count + 1;
    const newBadges = [...state.badges];

    // Award badges
    if (newCount === 1 && !newBadges.includes('first-feedback')) {
      newBadges.push('first-feedback');
    }
    if (newCount === 10 && !newBadges.includes('feedback-champion')) {
      newBadges.push('feedback-champion');
    }

    setState({
      ...state,
      count: newCount,
      lastSubmitted: Date.now(),
      badges: newBadges
    });

    // Send to backend
    console.log('Feedback submitted:', feedback);
  };

  const dismissSurvey = (surveyId: string) => {
    setState({
      ...state,
      surveysDismissed: [...state.surveysDismissed, surveyId]
    });
  };

  const shouldShowSurvey = (surveyId: string): boolean => {
    return !state.surveysDismissed.includes(surveyId);
  };

  const getBadgeProgress = (badgeId: string): number => {
    switch (badgeId) {
      case 'first-feedback':
        return Math.min(state.count, 1);
      case 'feedback-champion':
        return Math.min(state.count, 10);
      default:
        return 0;
    }
  };

  return {
    feedbackCount: state.count,
    badges: state.badges,
    submitFeedback,
    dismissSurvey,
    shouldShowSurvey,
    getBadgeProgress
  };
};
