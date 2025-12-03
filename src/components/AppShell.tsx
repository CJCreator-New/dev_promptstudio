import React, { Suspense } from 'react';
import Header from './Header';
import PromptInput from './PromptInput';
import PromptOutput from './PromptOutput';
import { LoadingFallback } from '../App.lazy';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Minimal app shell that renders immediately
 * Heavy components load progressively
 */
export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Suspense fallback={<div className="h-16 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700" />}>
        {children}
      </Suspense>
    </div>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex-1 max-w-[1920px] w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 flex flex-col lg:flex-row gap-4 lg:gap-5 relative">
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </main>
  );
};
