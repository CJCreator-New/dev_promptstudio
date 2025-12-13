import { useCallback } from 'react';
import { CustomTemplate, DomainType } from '../types';
import { useAppStore, useDataStore, useUIStore } from '../store';
import { notifySuccess, notifyError } from '../components/ToastSystem';
import { trackEvent } from '../utils/analytics';

export const useTemplateActions = () => {
  const { input, options, setInput, setOptions } = useAppStore();
  const { addCustomTemplate, updateCustomTemplate, deleteCustomTemplate } = useDataStore();
  const { 
    templateModalMode, 
    editingTemplateId, 
    templateFormData,
    setTemplateModalOpen,
    setTemplateModalMode,
    setEditingTemplateId,
    setTemplateFormData,
    setMobileHistoryOpen,
    isReadOnly,
    setReadOnly
  } = useUIStore();

  const openCreateTemplate = useCallback(() => {
    setTemplateModalMode('create');
    
    let suggestedDomain = options.domain;
    const lowerInput = input.toLowerCase();

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
  }, [input, options.domain, setTemplateModalMode, setTemplateFormData, setTemplateModalOpen]);

  const openEditTemplate = useCallback((template: CustomTemplate) => {
    setTemplateModalMode('edit');
    setEditingTemplateId(template.id);
    setTemplateFormData({ name: template.name, text: template.text, domain: template.domain });
    setTemplateModalOpen(true);
  }, [setTemplateModalMode, setEditingTemplateId, setTemplateFormData, setTemplateModalOpen]);

  const saveTemplate = useCallback(() => {
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
  }, [templateFormData, templateModalMode, editingTemplateId, addCustomTemplate, updateCustomTemplate, setTemplateModalOpen, setEditingTemplateId]);

  const loadTemplate = useCallback((template: CustomTemplate) => {
    if (input.trim().length > 0 && !window.confirm("Replace current input text with this template?")) {
      return;
    }
    setInput(template.text);
    setOptions({ domain: template.domain });
    setMobileHistoryOpen(false);
    if (isReadOnly) {
      setReadOnly(false);
      const url = new URL(window.location.href);
      url.searchParams.delete('share');
      window.history.replaceState({}, '', url);
    }
    notifySuccess(`Applied template: ${template.name}`);
  }, [input, setInput, setOptions, setMobileHistoryOpen, isReadOnly, setReadOnly]);

  const deleteTemplate = useCallback((id: string) => {
    if (window.confirm("Delete this template?")) {
      deleteCustomTemplate(id);
      notifySuccess("Template deleted");
    }
  }, [deleteCustomTemplate]);

  return { 
    openCreateTemplate, 
    openEditTemplate, 
    saveTemplate, 
    loadTemplate, 
    deleteTemplate 
  };
};
