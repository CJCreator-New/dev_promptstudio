import { lazy, Suspense } from 'react';

// Lazy load heavy components
export const HistorySidebar = lazy(() => import('./components/HistorySidebar'));
export const ApiKeyManager = lazy(() => import('./components/settings/ApiKeyManager').then(m => ({ default: m.ApiKeyManager })));
export const FeedbackModal = lazy(() => import('./components/FeedbackModal').then(m => ({ default: m.FeedbackModal })));
export const RecoveryModal = lazy(() => import('./components/RecoveryModal').then(m => ({ default: m.RecoveryModal })));
export const ApiKeySetupModal = lazy(() => import('./components/ApiKeySetupModal').then(m => ({ default: m.ApiKeySetupModal })));
export const ShareModal = lazy(() => import('./components/ShareModal'));
export const TemplateGallery = lazy(() => import('./components/TemplateGallery'));
export const VersionTimeline = lazy(() => import('./components/VersionTimeline'));
export const VersionCompare = lazy(() => import('./components/VersionCompare'));
export const VariableEditor = lazy(() => import('./components/VariableEditor'));
export const ABTestWorkspace = lazy(() => import('./components/ABTestWorkspace'));
export const EvaluationPanel = lazy(() => import('./components/EvaluationPanel'));

// Loading fallback
export const LoadingFallback = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);
