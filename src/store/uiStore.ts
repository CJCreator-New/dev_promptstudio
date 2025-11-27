import { create } from 'zustand';
import { UIStore } from './types';
import { DomainType } from '../types';

export const useUIStore = create<UIStore>((set) => ({
  // State
  isMobileHistoryOpen: false,
  isTemplateModalOpen: false,
  templateModalMode: 'create',
  editingTemplateId: null,
  templateFormData: {
    name: '',
    text: '',
    domain: DomainType.FRONTEND,
  },
  isFeedbackOpen: false,
  isReadOnly: false,
  isBooting: true,

  // Actions
  setMobileHistoryOpen: (open) => set({ isMobileHistoryOpen: open }),
  setTemplateModalOpen: (open) => set({ isTemplateModalOpen: open }),
  setTemplateModalMode: (mode) => set({ templateModalMode: mode }),
  setEditingTemplateId: (id) => set({ editingTemplateId: id }),
  setTemplateFormData: (data) => 
    set((state) => ({ 
      templateFormData: { ...state.templateFormData, ...data } 
    })),
  setFeedbackOpen: (open) => set({ isFeedbackOpen: open }),
  setReadOnly: (readOnly) => set({ isReadOnly: readOnly }),
  setBooting: (booting) => set({ isBooting: booting }),
}));