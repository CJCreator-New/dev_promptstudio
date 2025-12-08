/**
 * Pre-configured empty states for common scenarios
 */

import React from 'react';
import { 
  FileText, Search, AlertCircle, Loader2, Filter, 
  Lock, PenTool, BarChart3, Inbox, Sparkles,
  FolderOpen, History, BookTemplate, Settings
} from 'lucide-react';
import { EmptyState, EmptyStateAction } from '../ui/EmptyState';

// First-time user empty states
export const FirstTimePrompts: React.FC<{ onCreatePrompt: () => void }> = ({ onCreatePrompt }) => (
  <EmptyState
    icon={Sparkles}
    title="Welcome to DevPrompt Studio"
    description="Start by creating your first AI prompt. We'll help you refine it into a production-ready specification."
    actions={[
      { label: 'Create Your First Prompt', onClick: onCreatePrompt, variant: 'primary' }
    ]}
    suggestions={[
      'Try a code review prompt',
      'Design an API specification',
      'Create a feature requirement doc'
    ]}
  />
);

export const FirstTimeHistory: React.FC<{ onEnhance: () => void }> = ({ onEnhance }) => (
  <EmptyState
    icon={History}
    title="No History Yet"
    description="Your enhanced prompts will appear here. Start by enhancing your first prompt to see it in action."
    actions={[
      { label: 'Enhance a Prompt', onClick: onEnhance, variant: 'primary' }
    ]}
  />
);

export const FirstTimeProjects: React.FC<{ onCreateProject: () => void }> = ({ onCreateProject }) => (
  <EmptyState
    icon={FolderOpen}
    title="No Saved Projects"
    description="Save your prompt configurations as projects for quick access later. Perfect for recurring workflows."
    actions={[
      { label: 'Save Current as Project', onClick: onCreateProject, variant: 'primary' }
    ]}
  />
);

export const FirstTimeTemplates: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => (
  <EmptyState
    icon={BookTemplate}
    title="No Custom Templates"
    description="Create reusable templates for your common prompt patterns. Start with our built-in recipes."
    actions={[
      { label: 'Browse Recipe Library', onClick: onBrowse, variant: 'primary' }
    ]}
  />
);

// Zero results states
export const NoSearchResults: React.FC<{ query: string; onClear: () => void }> = ({ query, onClear }) => (
  <EmptyState
    icon={Search}
    title="No Results Found"
    description={`We couldn't find anything matching "${query}". Try adjusting your search terms.`}
    actions={[
      { label: 'Clear Search', onClick: onClear, variant: 'secondary' }
    ]}
    suggestions={[
      'Check for typos',
      'Use fewer or different keywords',
      'Try more general terms'
    ]}
    compact
  />
);

export const NoFilteredResults: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <EmptyState
    icon={Filter}
    title="No Matching Items"
    description="No items match your current filters. Try adjusting or clearing them."
    actions={[
      { label: 'Clear All Filters', onClick: onReset, variant: 'secondary' }
    ]}
    compact
  />
);

// Error states
export const ErrorLoadingData: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <EmptyState
    icon={AlertCircle}
    title="Failed to Load Data"
    description="We couldn't load your data. This might be a temporary issue."
    actions={[
      { label: 'Try Again', onClick: onRetry, variant: 'primary' }
    ]}
    suggestions={[
      'Check your internet connection',
      'Refresh the page',
      'Your data is safely stored locally'
    ]}
  />
);

export const ErrorEnhancement: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <EmptyState
    icon={AlertCircle}
    title="Enhancement Failed"
    description={error || "We couldn't enhance your prompt. Please try again."}
    actions={[
      { label: 'Retry Enhancement', onClick: onRetry, variant: 'primary' }
    ]}
    suggestions={[
      'Check your API key in Settings',
      'Verify your internet connection',
      'Try a different AI provider'
    ]}
  />
);

// In-progress states
export const LoadingData: React.FC = () => (
  <EmptyState
    icon={Loader2}
    title="Loading..."
    description="Fetching your data. This should only take a moment."
    compact
  />
);

export const ProcessingPrompt: React.FC = () => (
  <EmptyState
    icon={Loader2}
    title="Enhancing Your Prompt"
    description="Our AI is analyzing and optimizing your prompt. This may take a few seconds."
    compact
  />
);

export const SyncingData: React.FC = () => (
  <EmptyState
    icon={Loader2}
    title="Syncing..."
    description="Synchronizing your data with the cloud."
    compact
  />
);

// Permission states
export const NoApiKey: React.FC<{ onAddKey: () => void }> = ({ onAddKey }) => (
  <EmptyState
    icon={Lock}
    title="API Key Required"
    description="To use AI enhancement features, please add your API key in Settings."
    actions={[
      { label: 'Add API Key', onClick: onAddKey, variant: 'primary', icon: <Settings className="w-4 h-4" /> }
    ]}
    suggestions={[
      'Get a free API key from Google AI Studio',
      'Or use OpenAI, Anthropic, or OpenRouter',
      'Your keys are stored securely in your browser'
    ]}
  />
);

export const OfflineMode: React.FC = () => (
  <EmptyState
    icon={AlertCircle}
    title="You're Offline"
    description="Some features require an internet connection. Your work is saved locally and will sync when you're back online."
    compact
  />
);

// User-generated content prompts
export const EmptyInbox: React.FC<{ onCompose: () => void }> = ({ onCompose }) => (
  <EmptyState
    icon={Inbox}
    title="Inbox Zero!"
    description="You're all caught up. No new notifications or messages."
    actions={[
      { label: 'Create New Prompt', onClick: onCompose, variant: 'secondary' }
    ]}
  />
);

export const NoContent: React.FC<{ contentType: string; onCreate: () => void }> = ({ contentType, onCreate }) => (
  <EmptyState
    icon={PenTool}
    title={`No ${contentType} Yet`}
    description={`Start creating ${contentType.toLowerCase()} to see them here.`}
    actions={[
      { label: `Create ${contentType}`, onClick: onCreate, variant: 'primary' }
    ]}
  />
);

// Data visualization placeholders
export const NoChartData: React.FC = () => (
  <EmptyState
    icon={BarChart3}
    title="No Data to Display"
    description="Start using the app to see analytics and insights here."
    compact
  />
);

export const InsufficientData: React.FC = () => (
  <EmptyState
    icon={BarChart3}
    title="Not Enough Data"
    description="We need more data points to generate meaningful insights. Keep using the app!"
    compact
  />
);
