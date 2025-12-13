import React from 'react';
import { FileText, Code, Zap, Sparkles } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface QuickStartTemplatesProps {
  templates: Template[];
  onSelect: (templateId: string) => void;
}

export const QuickStartTemplates: React.FC<QuickStartTemplatesProps> = ({ templates, onSelect }) => {
  return (
    <div>
      <p className="text-muted mb-6">
        Choose a template to get started quickly, or skip to create from scratch.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="p-6 rounded-xl border-2 border-border hover:border-accent-primary transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-colors">
                {template.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">{template.title}</div>
                <div className="text-sm text-muted">{template.description}</div>
                <div className="text-xs text-accent-primary mt-2">{template.category}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const defaultTemplates: Template[] = [
  {
    id: 'code-review',
    title: 'Code Review',
    description: 'Review code for best practices, bugs, and improvements',
    icon: <Code className="w-6 h-6" />,
    category: 'Development'
  },
  {
    id: 'api-design',
    title: 'API Design',
    description: 'Design RESTful APIs with proper endpoints and documentation',
    icon: <Zap className="w-6 h-6" />,
    category: 'Architecture'
  },
  {
    id: 'feature-spec',
    title: 'Feature Specification',
    description: 'Create detailed specifications for new features',
    icon: <FileText className="w-6 h-6" />,
    category: 'Planning'
  },
  {
    id: 'prompt-enhancement',
    title: 'Prompt Enhancement',
    description: 'Enhance and optimize AI prompts for better results',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'AI'
  }
];
