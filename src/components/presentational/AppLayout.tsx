import React, { ReactNode, memo } from 'react';
import { Eye, Edit3 } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  isReadOnly: boolean;
  onEditCopy: () => void;
}

export const AppLayout = memo<AppLayoutProps>(({ children, isReadOnly, onEditCopy }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent-primary/30 transition-colors">
      {isReadOnly && (
        <div className="bg-blue-900/20 border-b border-blue-500/20 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-blue-300">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Viewing Shared Prompt (Read Only)</span>
            </div>
            <button 
              onClick={onEditCopy}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 min-h-[44px] rounded-lg transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 focus:ring-blue-500 outline-none"
              aria-label="Make editable copy of this prompt"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Make Editable Copy
            </button>
          </div>
        </div>
      )}
      {children}
    </div>
  );
});

AppLayout.displayName = 'AppLayout';
