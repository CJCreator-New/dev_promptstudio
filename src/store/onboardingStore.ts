import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../utils/db';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface OnboardingState {
  steps: OnboardingStep[];
  currentStep: number;
  isComplete: boolean;
  isDismissed: boolean;
  dismissedAt?: number;
  completeStep: (stepId: string) => void;
  nextStep: () => void;
  dismiss: () => void;
  reset: () => void;
  checkStepCompletion: () => Promise<void>;
}

const INITIAL_STEPS: OnboardingStep[] = [
  {
    id: 'add-api-key',
    title: 'Add API Key',
    description: 'Connect your Gemini API key to start enhancing prompts',
    completed: false
  },
  {
    id: 'create-folder',
    title: 'Create First Folder',
    description: 'Organize your prompts by project or category',
    completed: false
  },
  {
    id: 'save-prompt',
    title: 'Save First Prompt',
    description: 'Try an example or write your own prompt',
    completed: false
  },
  {
    id: 'run-enhance',
    title: 'Run Enhancement',
    description: 'See AI improve your prompt in real-time',
    completed: false
  }
];

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      steps: INITIAL_STEPS,
      currentStep: 0,
      isComplete: false,
      isDismissed: false,
      
      completeStep: (stepId) => {
        set((state) => {
          const steps = state.steps.map(step =>
            step.id === stepId ? { ...step, completed: true } : step
          );
          const completedCount = steps.filter(s => s.completed).length;
          const isComplete = completedCount === steps.length;
          
          return {
            steps,
            currentStep: Math.min(completedCount, steps.length - 1),
            isComplete
          };
        });
      },
      
      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
        }));
      },
      
      dismiss: () => {
        set({ isDismissed: true, dismissedAt: Date.now() });
      },
      
      reset: () => {
        set({
          steps: INITIAL_STEPS,
          currentStep: 0,
          isComplete: false,
          isDismissed: false,
          dismissedAt: undefined
        });
      },
      
      checkStepCompletion: async () => {
        const state = get();
        
        // Check API key
        const hasApiKey = !!localStorage.getItem('userEmail');
        if (hasApiKey && !state.steps[0].completed) {
          state.completeStep('add-api-key');
        }
        
        // Check folder creation
        const folderCount = await db.folders?.count() || 0;
        if (folderCount > 0 && !state.steps[1].completed) {
          state.completeStep('create-folder');
        }
        
        // Check prompt saved
        const promptCount = await db.prompts?.count() || 0;
        if (promptCount > 0 && !state.steps[2].completed) {
          state.completeStep('save-prompt');
        }
        
        // Check enhancement run
        const historyCount = await db.history?.count() || 0;
        if (historyCount > 0 && !state.steps[3].completed) {
          state.completeStep('run-enhance');
        }
      }
    }),
    {
      name: 'onboarding-progress'
    }
  )
);
