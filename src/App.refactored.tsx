import React, { useEffect, useState, Suspense, lazy, useCallback, useMemo } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider, FeatureFlagsProvider } from './contexts';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppLayout } from './components/presentational/AppLayout';
import { MainWorkspace } from './components/presentational/MainWorkspace';
import { ModalManager } from './components/compound/ModalManager';
import Header from './components/Header';
import { AppToaster } from './components/ToastSystem';
import { LiveRegion } from './components/LiveRegion';
import { UpdateNotification } from './components/UpdateNotification';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OnboardingChecklist } from './components/OnboardingChecklist';
import { OnboardingManager } from './components/Onboarding/OnboardingManager';
import { AuthModal } from './components/AuthModal';
import { CloudSyncToggle } from './components/CloudSyncToggle';
import { RecentPromptsRail } from './components/RecentPromptsRail';

import { useUIStore, useAppStore, useDataStore } from './store';
import { useAuth } from './contexts';
import { useCloudSync } from './hooks/useCloudSync';
import { useHistoryActions } from './hooks/useHistoryActions';
import { useProjectActions } from './hooks/useProjectActions';
import { useTemplateActions } from './hooks/useTemplateActions';
import { usePromptEnhancement } from './components/containers/PromptEnhancementContainer';
import { useAutoSave } from './hooks/useAutoSave';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { HistoryItem, DomainType } from './types';
import { KeyProvider } from './types/apiKeys';
import { parseShareParam } from './utils/shareUtils';
import { EXAMPLE_PROMPTS } from './utils/constants';
import { db } from './utils/db';
import { reportWebVitals } from './utils/performance';
import { secureStorage } from './utils/secureStorage';
import { getFreeModels, shouldSync } from './services/openRouterSync';
import { useThemeStore } from './store/themeStore';
import { useApiKeyStore } from './store/useApiKeyStore';
import { trackEvent } from './utils/analytics';
import { notifySuccess, toast } from './components/ToastSystem';
import { extractVariables } from './utils/variableInterpolation';

// Lazy load heavy components
const FeedbackModal = lazy(() => import('./components/FeedbackModal').then(m => ({ default: m.FeedbackModal })));
const RecoveryModal = lazy(() => import('./components/RecoveryModal').then(m => ({ default: m.RecoveryModal })));
const HistorySidebar = lazy(() => import('./components/HistorySidebar'));
const ApiKeySetupModal = lazy(() => import('./components/ApiKeySetupModal').then(m => ({ default: m.ApiKeySetupModal })));
const ShareModal = lazy(() => import('./components/ShareModal').then(m => ({ default: m.ShareModal })));
const TemplateGallery = lazy(() => import('./components/TemplateGallery').then(m => ({ default: m.TemplateGallery })));
const VersionTimeline = lazy(() => import('./components/VersionTimeline').then(m => ({ default: m.VersionTimeline })));
const VersionCompare = lazy(() => import('./components/VersionCompare').then(m => ({ default: m.VersionCompare })));
const VariableEditor = lazy(() => import('./components/VariableEditor').then(m => ({ default: m.VariableEditor })));
const ABTestWorkspace = lazy(() => import('./components/ABTestWorkspace').then(m => ({ default: m.ABTestWorkspace })));
const EvaluationPanel = lazy(() => import('./components/EvaluationPanel').then(m => ({ default: m.EvaluationPanel })));

const AppContent: React.FC = () => {
  const { userId, logout } = useAuth();
  const { enabled: cloudSyncEnabled, toggle: toggleCloudSync } = useCloudSync();
  
  // Zustand stores
  const {
    isMobileHistoryOpen,
    isFeedbackOpen,
    isReadOnly,
    isBooting,
    setMobileHistoryOpen,
    setFeedbackOpen,
    setReadOnly,
    setBooting,
  } = useUIStore();

  const {
    input,
    options,
    enhancedPrompt,
    originalPrompt,
    isLoading,
    recoveryDraft,
    setInput,
    setOptions,
    setRecoveryDraft,
    resetPrompts,
  } = useAppStore();

  const { history } = useDataStore();

  // Custom hooks
  const { status: saveStatus, lastSaved } = useAutoSave(input, options);
  const { rerunPrompt, duplicatePrompt } = useHistoryActions();
  const { saveProject, loadProject, deleteProject } = useProjectActions();
  const { openCreateTemplate, openEditTemplate, loadTemplate, deleteTemplate } = useTemplateActions();

  // Local state
  const [liveMessage, setLiveMessage] = useState('');
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [versionItem, setVersionItem] = useState<HistoryItem | null>(null);
  const [compareVersions, setCompareVersions] = useState<{ v1: string; v2: string } | null>(null);
  const [variableTemplate, setVariableTemplate] = useState<{ template: string; domain: DomainType } | null>(null);
  const [showABTest, setShowABTest] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  
  const [selectedProvider, setSelectedProvider] = useState<KeyProvider>(() => {
    const { keys } = useApiKeyStore.getState();
    if (keys.gemini?.status === 'verified') return 'gemini';
    if (keys.openai?.status === 'verified') return 'openai';
    if (keys.claude?.status === 'verified') return 'claude';
    if (keys.openrouter?.status === 'verified') return 'openrouter';
    return 'gemini';
  });

  // Enhancement logic
  const { handleEnhance } = usePromptEnhancement({
    input,
    options,
    selectedProvider,
    cloudSyncEnabled,
    onProviderChange: setSelectedProvider,
    onLiveMessage: setLiveMessage,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'e',
      ctrl: true,
      description: 'Enhance prompt',
      action: () => !isLoading && input.trim() && handleEnhance()
    },
    {
      key: 's',
      ctrl: true,
      description: 'Save project',
      action: () => input.trim() && saveProject()
    }
  ]);

  // Initialization
  useEffect(() => {
    useThemeStore.getState().initTheme();
    
    requestIdleCallback(() => {
      reportWebVitals(console.log);
      secureStorage.migrateExistingKeys().catch(console.error);
      
      const syncFreeModels = async () => {
        const { keys } = useApiKeyStore.getState();
        const openRouterKey = keys.openrouter?.value;
        
        if (openRouterKey && shouldSync()) {
          try {
            await getFreeModels(openRouterKey);
            console.log('✅ OpenRouter free models synced');
          } catch (error) {
            console.warn('Failed to sync OpenRouter free models:', error);
          }
        }
      };
      syncFreeModels();
      
      const hasApiKey = localStorage.getItem('hasApiKey');
      if (!hasApiKey) {
        setTimeout(() => setShowApiKeySetup(true), 2000);
      }
    }, { timeout: 2000 });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(timer);
  }, [setBooting]);

  // Share parameter handling
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const shareParam = searchParams.get('share');
    
    if (shareParam) {
      const sharedData = parseShareParam(shareParam);
      if (sharedData) {
        setInput(sharedData.input);
        setOptions({
          ...sharedData.options,
          targetTool: sharedData.options.targetTool || 'general'
        });
        setReadOnly(true);
        toast('Loaded shared prompt', { icon: '🔗' });
      }
    } else {
      checkRecovery();
    }
  }, []);

  const checkRecovery = async () => {
    try {
      const lastDraft = await db.drafts.orderBy('timestamp').last();
      if (lastDraft && lastDraft.input.trim().length > 0) {
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (Date.now() - lastDraft.timestamp < ONE_DAY) {
          setRecoveryDraft(lastDraft);
        }
      }
    } catch (e) {
      console.error("Failed to check recovery", e);
    }
  };

  // Memoized handlers
  const handleChainPrompt = useCallback((output: string) => {
    setInput(output);
    resetPrompts();
    notifySuccess("Output chained to input. Ready for next step.");
    setLiveMessage("Output chained to input for next enhancement");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setInput, resetPrompts]);

  const handleShare = useCallback(() => {
    if (!enhancedPrompt) return;
    setShowShareModal(true);
    trackEvent('share_opened');
  }, [enhancedPrompt]);

  const handleABTest = useCallback(() => {
    setShowABTest(true);
    trackEvent('ab_test_opened');
  }, []);

  const handleEvaluate = useCallback(() => {
    if (!enhancedPrompt) return;
    setShowEvaluation(true);
    trackEvent('evaluation_opened');
  }, [enhancedPrompt]);

  const handleEditCopy = useCallback(() => {
    setReadOnly(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url);
    notifySuccess("Mode switched to Editing");
  }, [setReadOnly]);

  const handleApplyTemplate = useCallback((template: string, domain: DomainType) => {
    const vars = extractVariables(template);
    if (vars.length > 0) {
      setVariableTemplate({ template, domain });
    } else {
      setInput(template);
      setOptions({ domain });
      notifySuccess('Template applied!');
    }
  }, [setInput, setOptions]);

  const handleSaveAsTemplate = useCallback((item: HistoryItem) => {
    setInput(item.original);
    openCreateTemplate();
    trackEvent('template_from_history', { prompt_id: item.id });
  }, [setInput, openCreateTemplate]);

  const handleViewVersions = useCallback((item: HistoryItem) => {
    setVersionItem(item);
    trackEvent('version_history_opened', { prompt_id: item.id });
  }, []);

  const handleCompareVersions = useCallback((v1: string, v2: string) => {
    setCompareVersions({ v1, v2 });
    setVersionItem(null);
  }, []);

  return (
    <AppLayout isReadOnly={isReadOnly} onEditCopy={handleEditCopy}>
      <AppToaster />
      <LiveRegion message={liveMessage} priority="polite" />
      <UpdateNotification />
      <OfflineIndicator />
      <OnboardingChecklist />
      
      <Suspense fallback={null}>
        {recoveryDraft && (
          <RecoveryModal 
            draft={recoveryDraft}
            onRestore={() => {
              if (recoveryDraft) {
                setInput(recoveryDraft.input);
                setOptions(recoveryDraft.options);
                notifySuccess("Session restored!");
              }
              setRecoveryDraft(null);
            }}
            onDiscard={() => setRecoveryDraft(null)}
          />
        )}
        
        <FeedbackModal 
          isOpen={isFeedbackOpen} 
          onClose={() => setFeedbackOpen(false)} 
        />
        
        <ApiKeySetupModal 
          isOpen={showApiKeySetup} 
          onClose={() => setShowApiKeySetup(false)} 
        />
      </Suspense>
      
      <OnboardingManager isBooting={isBooting} />

      <a href="#main-input" className="skip-link">
        Skip to main content
      </a>

      <Header 
        onFeedback={() => setFeedbackOpen(true)} 
        onLogout={logout}
        onTemplateGallery={() => setShowTemplateGallery(true)}
      >
        <CloudSyncToggle 
          enabled={cloudSyncEnabled}
          onToggle={toggleCloudSync}
        />
      </Header>

      <MainWorkspace
        input={input}
        setInput={setInput}
        options={options}
        setOptions={setOptions}
        enhancedPrompt={enhancedPrompt}
        originalPrompt={originalPrompt}
        isLoading={isLoading}
        isBooting={isBooting}
        isReadOnly={isReadOnly}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        provider={selectedProvider}
        onProviderChange={setSelectedProvider}
        onEnhance={handleEnhance}
        onSave={saveProject}
        onSaveTemplate={openCreateTemplate}
        onShare={handleShare}
        onChainPrompt={handleChainPrompt}
        onABTest={handleABTest}
        onEvaluate={handleEvaluate}
        onMobileHistoryOpen={() => setMobileHistoryOpen(true)}
      />

      <RecentPromptsRail
        history={history}
        onRerun={rerunPrompt}
        onSaveAsTemplate={handleSaveAsTemplate}
        onDuplicate={duplicatePrompt}
        onViewVersions={handleViewVersions}
      />

      <Suspense fallback={null}>
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          original={originalPrompt || ''}
          enhanced={enhancedPrompt || ''}
          options={options}
        />

        <TemplateGallery
          isOpen={showTemplateGallery}
          onClose={() => setShowTemplateGallery(false)}
          onApply={handleApplyTemplate}
        />

        {versionItem && (
          <VersionTimeline
            item={versionItem}
            onClose={() => setVersionItem(null)}
            onCompare={handleCompareVersions}
          />
        )}

        {compareVersions && (
          <VersionCompare
            v1={compareVersions.v1}
            v2={compareVersions.v2}
            onClose={() => setCompareVersions(null)}
          />
        )}

        {variableTemplate && (
          <VariableEditor
            template={variableTemplate.template}
            onApply={(result) => {
              if (variableTemplate) {
                setInput(result);
                setOptions({ domain: variableTemplate.domain });
                notifySuccess('Template applied with variables!');
              }
            }}
            onClose={() => setVariableTemplate(null)}
          />
        )}

        <ABTestWorkspace
          isOpen={showABTest}
          onClose={() => setShowABTest(false)}
          basePrompt={input}
        />

        <EvaluationPanel
          isOpen={showEvaluation}
          onClose={() => setShowEvaluation(false)}
          output={enhancedPrompt || ''}
        />
      </Suspense>
    </AppLayout>
  );
};

const App: React.FC = () => {
  const skipAuth = typeof window !== 'undefined' && localStorage.getItem('skipAuth') === 'true';
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider skipAuth={skipAuth}>
          <FeatureFlagsProvider>
            <ModalManager>
              <AppContent />
            </ModalManager>
          </FeatureFlagsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
