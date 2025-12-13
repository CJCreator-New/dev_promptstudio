import React from 'react';
import { Award, Star, Trophy, Zap } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  total?: number;
}

interface FeedbackBadgeProps {
  badges: Badge[];
  className?: string;
}

export const FeedbackBadge: React.FC<FeedbackBadgeProps> = ({ badges, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`p-4 rounded-lg border-2 transition-all ${
            badge.earned
              ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
              : 'border-border bg-elevated opacity-60'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
            badge.earned ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            {badge.icon}
          </div>
          <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
          <p className="text-xs text-muted mb-2">{badge.description}</p>
          {badge.progress !== undefined && badge.total && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>{badge.progress}/{badge.total}</span>
                <span>{Math.round((badge.progress / badge.total) * 100)}%</span>
              </div>
              <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-primary transition-all"
                  style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const defaultBadges: Badge[] = [
  {
    id: 'first-feedback',
    name: 'First Feedback',
    description: 'Submit your first feedback',
    icon: <Star className="w-6 h-6" />,
    earned: false,
    progress: 0,
    total: 1
  },
  {
    id: 'feedback-champion',
    name: 'Feedback Champion',
    description: 'Submit 10 pieces of feedback',
    icon: <Trophy className="w-6 h-6" />,
    earned: false,
    progress: 0,
    total: 10
  },
  {
    id: 'quick-responder',
    name: 'Quick Responder',
    description: 'Respond to 5 surveys',
    icon: <Zap className="w-6 h-6" />,
    earned: false,
    progress: 0,
    total: 5
  },
  {
    id: 'community-contributor',
    name: 'Community Contributor',
    description: 'Schedule a user interview',
    icon: <Award className="w-6 h-6" />,
    earned: false
  }
];
