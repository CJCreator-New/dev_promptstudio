import { ReactNode } from 'react';
import { EnhancementOptions, HistoryItem, SavedProject, CustomTemplate } from './index';
import { KeyProvider } from './apiKeys';

// Presentational Component Props
export interface AppLayoutProps {
  children: ReactNode;
  isReadOnly: boolean;
  onEditCopy: () => void;
}

export interface MainWorkspaceProps {
  input: string;
  setInput: (value: string) => void;
  options: EnhancementOptions;
  setOptions: (options: EnhancementOptions) => void;
  enhancedPrompt: string | null;
  originalPrompt: string | null;
  isLoading: boolean;
  isBooting: boolean;
  isReadOnly: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: number | null;
  provider: KeyProvider;
  onProviderChange: (provider: KeyProvider) => void;
  onEnhance: () => void;
  onSave: () => void;
  onSaveTemplate: () => void;
  onShare: () => void;
  onChainPrompt: (output: string) => void;
  onABTest: () => void;
  onEvaluate: () => void;
  onMobileHistoryOpen: () => void;
}

// Container Component Props
export interface PromptEnhancementContainerProps {
  input: string;
  options: EnhancementOptions;
  selectedProvider: KeyProvider;
  cloudSyncEnabled: boolean;
  onProviderChange: (provider: KeyProvider) => void;
  onLiveMessage: (message: string) => void;
}

// Modal Props
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ConfirmModalProps extends BaseModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

// History Props
export interface HistoryActionsProps {
  item: HistoryItem;
  onRerun: (item: HistoryItem) => void;
  onDuplicate: (item: HistoryItem) => void;
  onSaveAsTemplate: (item: HistoryItem) => void;
  onViewVersions: (item: HistoryItem) => void;
}

// Project Props
export interface ProjectActionsProps {
  project: SavedProject;
  onLoad: (project: SavedProject) => void;
  onDelete: (id: string) => void;
}

// Template Props
export interface TemplateActionsProps {
  template: CustomTemplate;
  onLoad: (template: CustomTemplate) => void;
  onEdit: (template: CustomTemplate) => void;
  onDelete: (id: string) => void;
}
