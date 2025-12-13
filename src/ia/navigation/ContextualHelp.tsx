import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpContent {
  id: string;
  title: string;
  content: string;
  links?: Array<{ label: string; url: string }>;
}

interface ContextualHelpProps {
  content: HelpContent;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({ 
  content, 
  position = 'top',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-muted hover:text-accent-primary transition-colors"
        aria-label="Show help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`
            absolute ${positionClasses[position]} z-50
            w-80 bg-elevated border border-border rounded-lg shadow-lg p-4
          `}>
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">{content.title}</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-foreground"
                aria-label="Close help"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted mb-3">{content.content}</p>
            {content.links && (
              <div className="space-y-1">
                {content.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-sm text-accent-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const helpContent: Record<string, HelpContent> = {
  promptInput: {
    id: 'promptInput',
    title: 'Prompt Input',
    content: 'Enter your rough idea or concept. The AI will enhance it based on your selected options.',
    links: [
      { label: 'Best Practices', url: '/docs/prompts' },
      { label: 'Examples', url: '/examples' }
    ]
  },
  templates: {
    id: 'templates',
    title: 'Templates',
    content: 'Save frequently used prompts as templates for quick reuse.',
    links: [
      { label: 'Template Guide', url: '/docs/templates' }
    ]
  }
};
