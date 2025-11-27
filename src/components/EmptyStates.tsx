import React, { useEffect } from 'react';
import { Clock, Folder, LayoutTemplate, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { logger } from '../utils/errorLogging';

// --- Base Generic Empty State ---
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  benefits?: string[];
  variant?: 'A' | 'B'; // For simple A/B testing
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  benefits,
  variant = 'A'
}) => {
  
  // Track impression on mount using info level
  useEffect(() => {
    logger.info('Empty State Impression', { title, variant });
  }, [title, variant]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 animate-in fade-in duration-500">
      <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-inner">
        {icon}
      </div>
      
      <h3 className="text-sm font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed mb-6">
        {description}
      </p>

      {benefits && (
        <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-[260px]">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded text-[10px] text-slate-400">
              <CheckCircle className="w-3 h-3 text-indigo-500" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-[200px]">
        {primaryAction && (
          <button
            onClick={() => {
              logger.info('Empty State CTA Clicked', { action: 'primary', title });
              primaryAction.onClick();
            }}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-all shadow-lg shadow-indigo-900/20 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {primaryAction.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        
        {secondaryAction && (
          <button
            onClick={() => {
              if (secondaryAction.onClick) secondaryAction.onClick();
            }}
            className="text-[11px] text-slate-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-1 group"
          >
            {secondaryAction.label}
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

// --- Specific Implementations ---

export const HistoryEmptyState: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <EmptyState
    icon={<Clock className="w-6 h-6" />}
    title="Your prompt history will appear here"
    description="Enhance your first prompt to start building your personal history log."
    primaryAction={{
      label: "Try an Example Prompt",
      onClick: onAction
    }}
    secondaryAction={{
      label: "Learn how history works"
    }}
  />
);

export const ProjectsEmptyState: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <EmptyState
    icon={<Folder className="w-6 h-6" />}
    title="Save your best prompts for later"
    description="Organize your work by topic and access it from any device."
    benefits={["Access anywhere", "Organize by topic", "Share with team"]}
    primaryAction={{
      label: "Create Your First Project",
      onClick: onAction
    }}
  />
);

export const TemplatesEmptyState: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <EmptyState
    icon={<LayoutTemplate className="w-6 h-6" />}
    title="Build reusable templates"
    description="Save common structures to speed up your workflow."
    primaryAction={{
      label: "Create Template from Input",
      onClick: onAction
    }}
    secondaryAction={{
      label: "Browse Community Templates"
    }}
  />
);