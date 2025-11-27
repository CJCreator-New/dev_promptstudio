import React from 'react';
import { Skeleton } from './LoadingPrimitives';

// --- Configuration Panel Skeleton ---
export const ConfigPanelSkeleton: React.FC = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-800/20 animate-pulse-subtle">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
};

// --- Suggestions Skeleton ---
export const SuggestionsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-2 items-center mt-2">
      <Skeleton className="w-20 h-3 mr-2" /> {/* "SUGGESTIONS:" label */}
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-6 w-20 rounded-md" />
      ))}
    </div>
  );
};

// --- Output Preview Skeleton ---
export const OutputPreviewSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-4">
      {/* Simulated Heading */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4 rounded-lg bg-indigo-900/20" />
        <Skeleton className="h-4 w-1/2 rounded bg-slate-800/40" />
      </div>

      <div className="h-6" /> {/* Spacer */}

      {/* Simulated Paragraph */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      <div className="h-4" />

      {/* Simulated Code Block */}
      <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/50 space-y-2">
         <Skeleton className="h-3 w-32 mb-3 bg-slate-700/30" />
         <Skeleton className="h-3 w-full" />
         <Skeleton className="h-3 w-10/12" />
         <Skeleton className="h-3 w-11/12" />
      </div>
    </div>
  );
};