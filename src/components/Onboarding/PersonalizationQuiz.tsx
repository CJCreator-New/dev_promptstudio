import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface QuizOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
}

interface PersonalizationQuizProps {
  questions: QuizQuestion[];
  onComplete: (answers: Record<string, string | string[]>) => void;
}

export const PersonalizationQuiz: React.FC<PersonalizationQuizProps> = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleSingleSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleMultiSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || [];
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      return { ...prev, [questionId]: updated };
    });
  };

  return (
    <div className="space-y-8">
      {questions.map(question => (
        <div key={question.id}>
          <h3 className="font-semibold mb-4">{question.question}</h3>
          <div className="grid gap-3">
            {question.options.map(option => {
              const isSelected = question.type === 'single'
                ? answers[question.id] === option.id
                : (answers[question.id] as string[] || []).includes(option.id);

              return (
                <button
                  key={option.id}
                  onClick={() =>
                    question.type === 'single'
                      ? handleSingleSelect(question.id, option.id)
                      : handleMultiSelect(question.id, option.id)
                  }
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${isSelected
                      ? 'border-accent-primary bg-accent-primary/10'
                      : 'border-border hover:border-accent-primary/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {option.icon && <div className="shrink-0">{option.icon}</div>}
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-muted mt-1">{option.description}</div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-accent-primary shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
