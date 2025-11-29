import React, { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import PromptOutput from './components/PromptOutput';
import { enhancePromptWithKey } from './services/enhancementService';
import { HistoryItem, SavedProject, CustomTemplate, DomainType, GenerationMode } from './types';
import { generateShareLink, parseShareParam } from './utils/shareUtils';
import { withRetry, formatErrorMessage, createErrorContext, logError } from './utils/errorHandling';
import { measurePerformance } from './utils/performanceMonitor';
import { Menu, X, Eye, Edit3 } from 'lucide-react';
import { AppToaster, toast, notifySuccess, notifyError, showErrorWithRetry } from './components/ToastSystem';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EXAMPLE_PROMPTS } from './utils/constants';
import { useAutoSave } from './hooks/useAutoSave';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { db } from './utils/db';
import { reportWebVitals } from './utils/performance';
import { OnboardingManager } from './components/Onboarding/OnboardingManager';
import { LiveRegion } from './components/LiveRegion';
import { UpdateNotification } from './components/UpdateNotification';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LoginModal } from './components/LoginModal';
import { RecentPromptsRail } from './components/RecentPromptsRail';
import { ShareModal } from './components/ShareModal';
import { OnboardingChecklist } from './components/OnboardingChecklist';
import { TemplateGallery } from './components/TemplateGallery';
import { VersionTimeline } from './components/VersionTimeline';
import { VersionCompare } from './components/VersionCompare';
import { VariableEditor } from './components/VariableEditor';
import { ABTestWorkspace } from './components/ABTestWorkspace';
import { EvaluationPanel } from './components/EvaluationPanel';
import { extractVariables } from './utils/variableInterpolation';
import { isUserLoggedIn, saveUserSession } from './utils/auth';
import { useUIStore, useAppStore, useDataStore } from './store';
import { trackEvent } from './utils/analytics';

// Lazy load components
const FeedbackModal = lazy(() => import('./components/FeedbackModal').then(m => ({ default: m.FeedbackModal })));
const RecoveryModal = lazy(() => import('./components/RecoveryModal').then(m => ({ default: m.RecoveryModal })));
const HistorySidebar = lazy(() => import('./components/HistorySidebar'));
const ApiKeyManager = lazy(() => import('./components/settings/ApiKeyManager').then(m => ({ default: m.ApiKeyManager })));
const ApiKeySetupModal = lazy(() => import('./components/ApiKeySetupModal').then(m => ({ default: m.ApiKeySetupModal })));

const App: React.FC = () => {
  // Zustand stores
  const {
    isMobileHistoryOpen,
    isTemplateModalOpen,
    templateModalMode,
    editingTemplateId,
    templateFormData,
    isFeedbackOpen,
    isReadOnly,
    isBooting,
    setMobileHistoryOpen,
    setTemplateModalOpen,
    setTemplateModalMode,
    setEditingTemplateId,
    setTemplateFormData,
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
    setEnhancedPrompt,
    setOriginalPrompt,
    setLoading,
    setRecoveryDraft,
    resetPrompts,
  } = useAppStore();

  const {
    history,
    savedProjects,
    customTemplates,
    addHistoryItem,
    clearHistory,
    addSavedProject,
    deleteSavedProject,
    addCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
  } = useDataStore();

  const { status: saveStatus, lastSaved } = useAutoSave(input, options);
  const [liveMessage, setLiveMessage] = useState('');
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [versionItem, setVersionItem] = useState<HistoryItem | null>(null);
  const [compareVersions, setCompareVersions] = useState<{ v1: string; v2: string } | null>(null);
  const [variableTemplate, setVariableTemplate] = useState<{ template: string; domain: DomainType } | null>(null);
  const [showABTest, setShowABTest] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const handleLogin = (email: string) => {
    saveUserSession(email);
    setIsLoggedIn(true);
    notifySuccess('Welcome to DevPrompt Studio!');
  };

  const handleApplyTemplate = (template: string, domain: DomainType) => {
    const vars = extractVariables(template);
    if (vars.length > 0) {
      setVariableTemplate({ template, domain });
    } else {
      setInput(template);
      setOptions({ domain });
      notifySuccess('Template applied!');
    }
  };

  const handleVariableApply = (result: string) => {
    if (variableTemplate) {
      setInput(result);
      setOptions({ domain: variableTemplate.domain });
      notifySuccess('Template applied with variables!');
    }
  };
  
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
      action: () => input.trim() && handleSaveProject()
    }
  ]);

  useEffect(() => {
    reportWebVitals(console.log);
    
    // Check if user has API key
    const hasApiKey = localStorage.getItem('hasApiKey');
    if (!hasApiKey) {
      setTimeout(() => setShowApiKeySetup(true), 2000);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const inputEl = document.getElementById('main-input');
        if (inputEl) {
          inputEl.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [setBooting]);

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
        setEnhancedPrompt(sharedData.enhancedPrompt);
        setOriginalPrompt(sharedData.originalPrompt);
        setReadOnly(true);
        toast('Loaded shared prompt', { icon: '🔗' });
      }
    } else {
        checkRecovery();
    }
  }, [setInput, setOptions, setEnhancedPrompt, setOriginalPrompt, setReadOnly]);

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

  // Data persistence is now handled by Zustand middleware

  const handleEnhance = useCallback(async () => {
    if (!input.trim()) {
        notifyError("Please enter a prompt first.");
        return;
    }
    
    setLoading(true);
    setOriginalPrompt(input);
    setEnhancedPrompt("");
    
    const perfStart = performance.now();

    const TIMEOUT_MS = 60000; 
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out. The model is taking too long.")), TIMEOUT_MS)
    );

    const enhancePromise = withRetry(async () => {
        let accumulatedText = "";
        const stream = enhancePromptWithKey(input, options, 'gemini');
        
        for await (const chunk of stream) {
            accumulatedText += chunk;
            setEnhancedPrompt(accumulatedText);
        }

        if (!accumulatedText) throw new Error("No content generated.");

        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            original: input,
            enhanced: accumulatedText,
            timestamp: Date.now(),
            domain: options.domain,
            mode: options.mode
        };
        addHistoryItem(newItem);
        setLiveMessage(`${options.mode === GenerationMode.OUTLINE ? 'Outline' : 'Prompt'} generated successfully`);
        trackEvent('prompt_enhanced', { 
          mode: options.mode, 
          domain: options.domain, 
          input_length: input.length, 
          output_length: accumulatedText.length 
        });
    }, { maxAttempts: 3, delay: 1000, backoff: true });

    Promise.race([enhancePromise, timeoutPromise])
      .then(() => {
          const perfEnd = performance.now();
          const duration = perfEnd - perfStart;
          console.log(`⚡ Enhancement completed in ${duration.toFixed(2)}ms`);
          notifySuccess(options.mode === GenerationMode.OUTLINE ? "Outline generated!" : "Prompt enhanced!");
      })
      .catch((error: any) => {
         const context = createErrorContext('App', 'handleEnhance');
         logError(error, context);
         
         const userMessage = formatErrorMessage(error);
         
         if (error.name === 'RateLimitError' || error.message.includes("429")) {
             showErrorWithRetry(userMessage, handleEnhance);
         } else if (error.name === 'APIError' || error.message.includes("500") || error.message.includes("503")) {
             showErrorWithRetry(userMessage, handleEnhance);
         } else {
             notifyError(userMessage);
         }
      })
      .finally(() => {
          setLoading(false);
      });
  }, [input, options, setLoading, setOriginalPrompt, setEnhancedPrompt, addHistoryItem, setLiveMessage]);

  const handleChainPrompt = useCallback((output: string) => {
    setInput(output);
    resetPrompts();
    notifySuccess("Output chained to input. Ready for next step.");
    setLiveMessage("Output chained to input for next enhancement");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setInput, resetPrompts, setLiveMessage]);

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

  const handleRerunPrompt = useCallback((item: HistoryItem) => {
    setInput(item.original);
    setOptions({ domain: item.domain, mode: item.mode });
    notifySuccess('Prompt loaded from history');
    trackEvent('prompt_rerun', { prompt_id: item.id });
  }, [setInput, setOptions]);

  const handleSaveAsTemplate = useCallback((item: HistoryItem) => {
    setInput(item.original);
    handleOpenCreateTemplate();
    trackEvent('template_from_history', { prompt_id: item.id });
  }, [setInput]);

  const handleDuplicatePrompt = useCallback((item: HistoryItem) => {
    setInput(item.original);
    resetPrompts();
    notifySuccess('Prompt duplicated');
    trackEvent('prompt_duplicated', { prompt_id: item.id });
  }, [setInput, resetPrompts]);

  const handleViewVersions = useCallback((item: HistoryItem) => {
    setVersionItem(item);
    trackEvent('version_history_opened', { prompt_id: item.id });
  }, []);

  const handleCompareVersions = useCallback((v1: string, v2: string) => {
    setCompareVersions({ v1, v2 });
    setVersionItem(null);
  }, []);

  const handleEditCopy = useCallback(() => {
    setReadOnly(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url);
    notifySuccess("Mode switched to Editing");
  }, [setReadOnly]);

  const handleSaveProject = useCallback(() => {
    const name = window.prompt("Enter a name for this project:", "My Project");
    if (!name) return;

    const newProject: SavedProject = {
      id: crypto.randomUUID(),
      name,
      input,
      options,
      timestamp: Date.now()
    };

    addSavedProject(newProject);
    trackEvent('project_saved', { domain: options.domain, mode: options.mode });
    notifySuccess(`Project "${name}" saved!`);
  }, [input, options, addSavedProject]);

  const handleLoadProject = (project: SavedProject) => {
    if (window.confirm("Load this project? Current unsaved work will be replaced.")) {
      setInput(project.input);
      setOptions({
        ...project.options,
        targetTool: project.options.targetTool || 'general'
      });
      resetPrompts();
      setMobileHistoryOpen(false);
      if (isReadOnly) handleEditCopy();
      notifySuccess(`Loaded project "${project.name}"`);
    }
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteSavedProject(id);
      notifySuccess("Project deleted");
    }
  };

  const handleOpenCreateTemplate = () => {
    setTemplateModalMode('create');
    
    let suggestedDomain = options.domain;
    const lowerInput = input.toLowerCase();

    // Heuristics for auto-detecting domain
    if (lowerInput.match(/react|vue|angular|css|html|tailwind|frontend|ui|ux|web/)) {
        suggestedDomain = DomainType.FRONTEND;
    } else if (lowerInput.match(/node|express|api|sql|db|database|auth|backend|server|endpoint/)) {
        suggestedDomain = DomainType.BACKEND;
    } else if (lowerInput.match(/ios|android|react native|flutter|mobile|swift|kotlin/)) {
        suggestedDomain = DomainType.MOBILE;
    } else if (lowerInput.match(/docker|kubernetes|aws|ci\/cd|pipeline|cloud|terraform|deploy|azure/)) {
        suggestedDomain = DomainType.DEVOPS;
    } else if (lowerInput.match(/design|figma|color|typography|wireframe|layout/)) {
        suggestedDomain = DomainType.UI_UX;
    }

    setTemplateFormData({ name: '', text: input, domain: suggestedDomain }); 
    setTemplateModalOpen(true);
  };
  
  const handleOpenEditTemplate = (template: CustomTemplate) => {
    setTemplateModalMode('edit');
    setEditingTemplateId(template.id);
    setTemplateFormData({ name: template.name, text: template.text, domain: template.domain });
    setTemplateModalOpen(true);
  };

  const handleSaveTemplateForm = () => {
    if (!templateFormData.name.trim() || !templateFormData.text.trim()) {
        notifyError("Name and content are required.");
        return;
    }
    
    if (templateModalMode === 'create') {
      const newTemplate: CustomTemplate = {
        id: crypto.randomUUID(),
        name: templateFormData.name,
        text: templateFormData.text,
        domain: templateFormData.domain as DomainType,
        timestamp: Date.now()
      };
      addCustomTemplate(newTemplate);
      trackEvent('template_created', { domain: templateFormData.domain, has_variables: templateFormData.text.includes('{{') });
      notifySuccess(`Template "${templateFormData.name}" created!`);
    } else {
      if (editingTemplateId) {
        updateCustomTemplate(editingTemplateId, {
          name: templateFormData.name,
          text: templateFormData.text,
          domain: templateFormData.domain as DomainType,
        });
      }
      notifySuccess(`Template "${templateFormData.name}" updated!`);
    }
    
    setTemplateModalOpen(false);
    setEditingTemplateId(null);
  };

  const handleLoadTemplate = (template: CustomTemplate) => {
    if (input.trim().length > 0 && !window.confirm("Replace current input text with this template?")) {
      return;
    }
    setInput(template.text);
    setOptions({ domain: template.domain });
    setMobileHistoryOpen(false);
    if (isReadOnly) handleEditCopy();
    notifySuccess(`Applied template: ${template.name}`);
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm("Delete this template?")) {
      deleteCustomTemplate(id);
      notifySuccess("Template deleted");
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setInput(item.original);
    setOriginalPrompt(item.original);
    setEnhancedPrompt(item.enhanced);
    setOptions({ domain: item.domain });
    setMobileHistoryOpen(false);
    if (isReadOnly) handleEditCopy();
    notifySuccess("Restored history item");
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all history?")) {
      clearHistory();
      notifySuccess("History cleared");
    }
  };
  
  const handleLoadRandomExample = () => {
    const randomExample = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    if (randomExample) {
      setInput(randomExample.text);
      setOptions({ domain: randomExample.domain });
      setMobileHistoryOpen(false);
      notifySuccess(`Loaded example: ${randomExample.label}`);
    }
  };

  const handleStartProject = () => {
    setMobileHistoryOpen(false);
    const inputEl = document.getElementById('main-input');
    if (inputEl) {
        inputEl.focus();
        if (!input.trim()) {
            toast('Start typing your prompt to create a project', { icon: '✍️' });
        } else {
            handleSaveProject();
        }
    }
  };

  const handleRestoreSession = () => {
      if (recoveryDraft) {
          setInput(recoveryDraft.input);
          setOptions(recoveryDraft.options);
          notifySuccess("Session restored!");
      }
      setRecoveryDraft(null);
  };

  const handleDiscardSession = () => {
      setRecoveryDraft(null);
  };

  if (!isLoggedIn) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
        <AppToaster />
        <LiveRegion message={liveMessage} priority="polite" />
        <UpdateNotification />
        <OfflineIndicator />
        <OnboardingChecklist />
        
        <Suspense fallback={null}>
          {recoveryDraft && (
              <RecoveryModal 
                  draft={recoveryDraft}
                  onRestore={handleRestoreSession}
                  onDiscard={handleDiscardSession}
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
          onLogout={() => setIsLoggedIn(false)}
          onTemplateGallery={() => setShowTemplateGallery(true)}
        />
        
        {isReadOnly && (
          <div className="bg-blue-900/20 border-b border-blue-500/20 py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-blue-300">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Viewing Shared Prompt (Read Only)</span>
              </div>
              <button 
                onClick={handleEditCopy}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 min-h-[44px] rounded-lg transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 focus:ring-blue-500 outline-none"
                aria-label="Make editable copy of this prompt"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Make Editable Copy
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 max-w-[1920px] w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 flex flex-col lg:flex-row gap-4 lg:gap-5 relative">
          
          <button 
            onClick={() => setMobileHistoryOpen(true)}
            className="lg:hidden fixed top-20 right-4 z-40 p-3 min-w-[44px] min-h-[44px] bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 focus:ring-2 focus:ring-blue-500 rounded-lg flex items-center justify-center shadow-lg border border-slate-700"
            aria-label="Open history sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 w-full lg:max-w-[45%] h-[calc(100vh-120px)] min-h-[400px]">
            <PromptInput 
              input={input}
              setInput={setInput}
              options={options}
              setOptions={setOptions}
              onEnhance={handleEnhance}
              onSave={handleSaveProject}
              onSaveTemplate={handleOpenCreateTemplate}
              isLoading={isLoading}
              isBooting={isBooting}
              readOnly={isReadOnly}
              saveStatus={saveStatus}
              lastSaved={lastSaved}
            />
          </div>

          <div className="flex-1 w-full lg:max-w-[45%] h-[calc(100vh-120px)] min-h-[400px]">
             <PromptOutput 
               enhancedPrompt={enhancedPrompt} 
               originalPrompt={originalPrompt}
               options={options}
               onShare={handleShare}
               onChainPrompt={handleChainPrompt}
               onABTest={handleABTest}
               onEvaluate={handleEvaluate}
               isLoading={isLoading}
             />
          </div>

          <div className="hidden lg:flex w-80 xl:w-96 h-[calc(100vh-120px)] flex-shrink-0 gap-4">
             <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
               <Suspense fallback={<div className="p-4 animate-pulse"><div className="h-4 bg-slate-600 rounded mb-2"></div><div className="h-4 bg-slate-600 rounded w-3/4"></div></div>}>
                 <HistorySidebar 
                   history={history} 
                   savedProjects={savedProjects}
                   customTemplates={customTemplates}
                   onSelectHistory={handleHistorySelect} 
                   onSelectProject={handleLoadProject}
                   onDeleteProject={handleDeleteProject}
                   onSelectTemplate={handleLoadTemplate}
                   onEditTemplate={handleOpenEditTemplate}
                   onCreateTemplate={handleOpenCreateTemplate}
                   onDeleteTemplate={handleDeleteTemplate}
                   onClearHistory={handleClearHistory} 
                   onLoadExample={handleLoadRandomExample}
                   onStartProject={handleStartProject}
                 />
               </Suspense>
             </div>
             
             <RecentPromptsRail
               history={history}
               onRerun={handleRerunPrompt}
               onSaveAsTemplate={handleSaveAsTemplate}
               onDuplicate={handleDuplicatePrompt}
               onViewVersions={handleViewVersions}
             />
          </div>

          {isMobileHistoryOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true" aria-label="History Sidebar">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileHistoryOpen(false)}></div>
              <div className="relative w-80 max-w-[85%] h-full bg-slate-800 border-r border-slate-700 shadow-2xl animate-in slide-in-from-left duration-200">
                <div className="p-4 flex justify-end border-b border-slate-700">
                  <button onClick={() => setMobileHistoryOpen(false)} className="text-slate-400 hover:text-white focus:ring-2 focus:ring-blue-500 rounded-lg p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-700 hover:bg-slate-600" aria-label="Close sidebar">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <Suspense fallback={<div className="p-4 animate-pulse"><div className="h-4 bg-slate-700 rounded mb-2"></div><div className="h-4 bg-slate-700 rounded w-3/4"></div></div>}>
                  <HistorySidebar 
                    history={history} 
                    savedProjects={savedProjects}
                    customTemplates={customTemplates}
                    onSelectHistory={handleHistorySelect} 
                    onSelectProject={handleLoadProject}
                    onDeleteProject={handleDeleteProject}
                    onSelectTemplate={handleLoadTemplate}
                    onEditTemplate={handleOpenEditTemplate}
                    onCreateTemplate={handleOpenCreateTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    onClearHistory={handleClearHistory} 
                    onLoadExample={handleLoadRandomExample}
                    onStartProject={handleStartProject}
                  />
                </Suspense>
              </div>
            </div>
          )}

          {isTemplateModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setTemplateModalOpen(false)}></div>
              <div className="relative bg-slate-800 border border-slate-600 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-800">
                  <h3 id="modal-title" className="text-lg font-semibold text-white">
                    {templateModalMode === 'create' ? 'Create New Template' : 'Edit Template'}
                  </h3>
                  <button onClick={() => setTemplateModalOpen(false)} className="text-slate-400 hover:text-white transition-colors focus:ring-2 focus:ring-blue-500 rounded-lg p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-700 hover:bg-slate-600" aria-label="Close modal">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4 bg-slate-800">
                  <div>
                    <label htmlFor="template-name" className="block text-xs font-medium text-slate-300 uppercase mb-2">Template Name</label>
                    <input 
                      id="template-name"
                      type="text" 
                      value={templateFormData.name}
                      onChange={e => setTemplateFormData({ name: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="e.g., React Component Structure"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="template-domain" className="block text-xs font-medium text-slate-300 uppercase mb-2">Domain</label>
                    <select 
                       id="template-domain"
                       value={templateFormData.domain}
                       onChange={e => setTemplateFormData({ domain: e.target.value })}
                       className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                    >
                       {Object.values(DomainType).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="template-content" className="block text-xs font-medium text-slate-300 uppercase mb-2">Template Content</label>
                    <textarea 
                      id="template-content"
                      value={templateFormData.text}
                      onChange={e => setTemplateFormData({ text: e.target.value })}
                      className="w-full h-40 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono leading-relaxed"
                      placeholder="Enter your prompt template here..."
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-900 border-t border-slate-700 flex justify-end gap-3">
                  <button 
                    onClick={() => setTemplateModalOpen(false)}
                    className="px-4 py-3 min-h-[44px] text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-blue-500 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveTemplateForm}
                    disabled={!templateFormData.name.trim() || !templateFormData.text.trim()}
                    className="px-4 py-3 min-h-[44px] text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-900"
                  >
                    {templateModalMode === 'create' ? 'Create Template' : 'Update Template'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            original={originalPrompt}
            enhanced={enhancedPrompt}
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
              onApply={handleVariableApply}
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
            output={enhancedPrompt}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;