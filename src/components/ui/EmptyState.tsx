import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  suggestions?: string[];
  illustration?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actions = [],
  suggestions = [],
  illustration,
  compact = false
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-8' : 'py-16'}`}>
      {/* Icon or Illustration */}
      <div className={`mb-6 ${compact ? 'w-16 h-16' : 'w-24 h-24'} relative`}>
        {illustration || (
          <div className="w-full h-full bg-slate-800/50 rounded-full flex items-center justify-center">
            <Icon className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} text-slate-500`} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`max-w-md space-y-3 ${compact ? 'mb-4' : 'mb-6'}`}>
        <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-white`}>
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6 max-w-md">
          <p className="text-xs font-medium text-slate-500 mb-3">Try:</p>
          <ul className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
