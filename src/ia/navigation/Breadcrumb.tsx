import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { SiteNode } from './sitemap';

interface BreadcrumbProps {
  path: SiteNode[];
  onNavigate?: (node: SiteNode) => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
      {path.map((node, index) => (
        <React.Fragment key={node.id}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-muted" />}
          <button
            onClick={() => onNavigate?.(node)}
            className={`
              flex items-center gap-1 hover:text-accent-primary transition-colors
              ${index === path.length - 1 ? 'text-foreground font-medium' : 'text-muted'}
            `}
            aria-current={index === path.length - 1 ? 'page' : undefined}
          >
            {index === 0 && <Home className="w-4 h-4" />}
            <span>{node.label}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};
