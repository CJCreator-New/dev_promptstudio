import React, { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { OnboardingFlow } from './OnboardingFlow';
import { PersonalizationQuiz } from './PersonalizationQuiz';
import { QuickStartTemplates, defaultTemplates } from './QuickStartTemplates';
import { CompletionCelebration } from './CompletionCelebration';
import { useOnboarding } from './useOnboarding';
import { Code, Palette, Rocket } from 'lucide-react';

export const OnboardingOrchestrator: React.FC = () => {
  const { isComplete, completeOnboarding, skipOnboarding } = useOnboarding();
  const [stage, setStage] = useState<'welcome' | 'flow' | 'complete'>('welcome');
  const [userData, setUserData] = useState<Record<string, any>>({});

  if (isComplete) return null;

  if (stage === 'welcome') {
    return (
      <WelcomeScreen
        onStart={() => setStage('flow')}
        onSkip={skipOnboarding}
      />
    );
  }

  if (stage === 'complete') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-elevated rounded-2xl shadow-2xl max-w-3xl w-full p-8">
          <CompletionCelebration
            userName={userData.name}
            onContinue={() => {
              completeOnboarding(userData);
            }}
          />
        </div>
      </div>
    );
  }

  const steps = [
    {
      id: 'personalization',
      title: 'Tell us about yourself',
      description: 'Help us personalize your experience',
      content: (
        <PersonalizationQuiz
          questions={[
            {
              id: 'role',
              question: 'What best describes your role?',
              type: 'single',
              options: [
                { id: 'developer', label: 'Developer', icon: <Code className="w-5 h-5" /> },
                { id: 'designer', label: 'Designer', icon: <Palette className="w-5 h-5" /> },
                { id: 'product', label: 'Product Manager', icon: <Rocket className="w-5 h-5" /> }
              ]
            },
            {
              id: 'goals',
              question: 'What are your main goals? (Select all that apply)',
              type: 'multiple',
              options: [
                { id: 'enhance', label: 'Enhance prompts', description: 'Improve AI prompt quality' },
                { id: 'collaborate', label: 'Team collaboration', description: 'Work with others' },
                { id: 'organize', label: 'Organize prompts', description: 'Manage prompt library' }
              ]
            }
          ]}
          onComplete={(answers) => setUserData(prev => ({ ...prev, ...answers }))}
        />
      )
    },
    {
      id: 'templates',
      title: 'Choose a starting point',
      description: 'Select a template or start from scratch',
      content: (
        <QuickStartTemplates
          templates={defaultTemplates}
          onSelect={(templateId) => setUserData(prev => ({ ...prev, template: templateId }))}
        />
      )
    }
  ];

  return (
    <OnboardingFlow
      steps={steps}
      onComplete={(data) => {
        setUserData(prev => ({ ...prev, ...data }));
        setStage('complete');
      }}
      onSkip={skipOnboarding}
    />
  );
};
