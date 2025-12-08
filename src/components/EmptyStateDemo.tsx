/**
 * Demo showcasing all empty state variants
 */

import React, { useState } from 'react';
import { 
  FirstTimePrompts, FirstTimeHistory, FirstTimeProjects, FirstTimeTemplates,
  NoSearchResults, NoFilteredResults,
  ErrorLoadingData, ErrorEnhancement,
  LoadingData, ProcessingPrompt, SyncingData,
  NoApiKey, OfflineMode,
  EmptyInbox, NoContent,
  NoChartData, InsufficientData
} from './emptyStates';
import { Button } from './ui/Button';

export const EmptyStateDemo: React.FC = () => {
  const [activeState, setActiveState] = useState<string>('first-time-prompts');

  const states = [
    { id: 'first-time-prompts', label: 'First Time Prompts', category: 'First-Time User' },
    { id: 'first-time-history', label: 'First Time History', category: 'First-Time User' },
    { id: 'first-time-projects', label: 'First Time Projects', category: 'First-Time User' },
    { id: 'first-time-templates', label: 'First Time Templates', category: 'First-Time User' },
    { id: 'no-search-results', label: 'No Search Results', category: 'Zero Results' },
    { id: 'no-filtered-results', label: 'No Filtered Results', category: 'Zero Results' },
    { id: 'error-loading', label: 'Error Loading Data', category: 'Error States' },
    { id: 'error-enhancement', label: 'Error Enhancement', category: 'Error States' },
    { id: 'loading-data', label: 'Loading Data', category: 'In-Progress' },
    { id: 'processing-prompt', label: 'Processing Prompt', category: 'In-Progress' },
    { id: 'syncing-data', label: 'Syncing Data', category: 'In-Progress' },
    { id: 'no-api-key', label: 'No API Key', category: 'Permissions' },
    { id: 'offline-mode', label: 'Offline Mode', category: 'Permissions' },
    { id: 'empty-inbox', label: 'Empty Inbox', category: 'User Content' },
    { id: 'no-content', label: 'No Content', category: 'User Content' },
    { id: 'no-chart-data', label: 'No Chart Data', category: 'Data Viz' },
    { id: 'insufficient-data', label: 'Insufficient Data', category: 'Data Viz' },
  ];

  const categories = [...new Set(states.map(s => s.category))];

  const renderEmptyState = () => {
    const handlers = {
      handleAction: () => console.log('Action clicked'),
      handleRetry: () => console.log('Retry clicked'),
      handleClear: () => console.log('Clear clicked'),
    };

    switch (activeState) {
      case 'first-time-prompts':
        return <FirstTimePrompts onCreatePrompt={handlers.handleAction} />;
      case 'first-time-history':
        return <FirstTimeHistory onEnhance={handlers.handleAction} />;
      case 'first-time-projects':
        return <FirstTimeProjects onCreateProject={handlers.handleAction} />;
      case 'first-time-templates':
        return <FirstTimeTemplates onBrowse={handlers.handleAction} />;
      case 'no-search-results':
        return <NoSearchResults query="example search" onClear={handlers.handleClear} />;
      case 'no-filtered-results':
        return <NoFilteredResults onReset={handlers.handleClear} />;
      case 'error-loading':
        return <ErrorLoadingData onRetry={handlers.handleRetry} />;
      case 'error-enhancement':
        return <ErrorEnhancement error="API key is invalid" onRetry={handlers.handleRetry} />;
      case 'loading-data':
        return <LoadingData />;
      case 'processing-prompt':
        return <ProcessingPrompt />;
      case 'syncing-data':
        return <SyncingData />;
      case 'no-api-key':
        return <NoApiKey onAddKey={handlers.handleAction} />;
      case 'offline-mode':
        return <OfflineMode />;
      case 'empty-inbox':
        return <EmptyInbox onCompose={handlers.handleAction} />;
      case 'no-content':
        return <NoContent contentType="Templates" onCreate={handlers.handleAction} />;
      case 'no-chart-data':
        return <NoChartData />;
      case 'insufficient-data':
        return <InsufficientData />;
      default:
        return <FirstTimePrompts onCreatePrompt={handlers.handleAction} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Empty State System</h1>
          <p className="text-slate-400">Context-specific guidance for every scenario</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sticky top-4">
              <h2 className="text-sm font-semibold text-slate-300 mb-4">Categories</h2>
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category}>
                    <h3 className="text-xs font-medium text-slate-500 mb-2">{category}</h3>
                    <div className="space-y-1">
                      {states
                        .filter(s => s.category === category)
                        .map(state => (
                          <button
                            key={state.id}
                            onClick={() => setActiveState(state.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              activeState === state.id
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                            }`}
                          >
                            {state.label}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 min-h-[600px] flex items-center justify-center">
              {renderEmptyState()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
