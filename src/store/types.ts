import { EnhancementOptions, HistoryItem, SavedProject, CustomTemplate, Draft } from '../types';

export interface UIState {
  isMobileHistoryOpen: boolean;
  isTemplateModalOpen: boolean;
  templateModalMode: 'create' | 'edit';
  editingTemplateId: string | null;
  templateFormData: {
    name: string;
    text: string;
    domain: string;
  };
  isFeedbackOpen: boolean;
  isReadOnly: boolean;
  isBooting: boolean;
}

export interface AppState {
  input: string;
  options: EnhancementOptions;
  enhancedPrompt: string | null;
  originalPrompt: string | null;
  isLoading: boolean;
  recoveryDraft: Draft | null;
}

export interface DataState {
  history: HistoryItem[];
  savedProjects: SavedProject[];
  customTemplates: CustomTemplate[];
}

export interface UIActions {
  setMobileHistoryOpen: (open: boolean) => void;
  setTemplateModalOpen: (open: boolean) => void;
  setTemplateModalMode: (mode: 'create' | 'edit') => void;
  setEditingTemplateId: (id: string | null) => void;
  setTemplateFormData: (data: Partial<UIState['templateFormData']>) => void;
  setFeedbackOpen: (open: boolean) => void;
  setReadOnly: (readOnly: boolean) => void;
  setBooting: (booting: boolean) => void;
}

export interface AppActions {
  setInput: (input: string) => void;
  setOptions: (options: Partial<EnhancementOptions>) => void;
  setEnhancedPrompt: (prompt: string | null) => void;
  setOriginalPrompt: (prompt: string | null) => void;
  setLoading: (loading: boolean) => void;
  setRecoveryDraft: (draft: Draft | null) => void;
  resetPrompts: () => void;
}

export interface DataActions {
  addHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;
  addSavedProject: (project: SavedProject) => void;
  deleteSavedProject: (id: string) => void;
  addCustomTemplate: (template: CustomTemplate) => void;
  updateCustomTemplate: (id: string, template: Partial<CustomTemplate>) => void;
  deleteCustomTemplate: (id: string) => void;
}

export type UIStore = UIState & UIActions;
export type AppStore = AppState & AppActions;
export type DataStore = DataState & DataActions;