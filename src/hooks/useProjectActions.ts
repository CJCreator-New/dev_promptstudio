import { useCallback } from 'react';
import { SavedProject } from '../types';
import { useAppStore, useDataStore, useUIStore } from '../store';
import { notifySuccess } from '../components/ToastSystem';
import { trackEvent } from '../utils/analytics';

export const useProjectActions = () => {
  const { input, options, setInput, setOptions, resetPrompts } = useAppStore();
  const { addSavedProject, deleteSavedProject } = useDataStore();
  const { setMobileHistoryOpen, isReadOnly, setReadOnly } = useUIStore();

  const saveProject = useCallback(() => {
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

  const loadProject = useCallback((project: SavedProject) => {
    if (window.confirm("Load this project? Current unsaved work will be replaced.")) {
      setInput(project.input);
      setOptions({
        ...project.options,
        targetTool: project.options.targetTool || 'general'
      });
      resetPrompts();
      setMobileHistoryOpen(false);
      if (isReadOnly) {
        setReadOnly(false);
        const url = new URL(window.location.href);
        url.searchParams.delete('share');
        window.history.replaceState({}, '', url);
      }
      notifySuccess(`Loaded project "${project.name}"`);
    }
  }, [setInput, setOptions, resetPrompts, setMobileHistoryOpen, isReadOnly, setReadOnly]);

  const deleteProject = useCallback((id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteSavedProject(id);
      notifySuccess("Project deleted");
    }
  }, [deleteSavedProject]);

  return { saveProject, loadProject, deleteProject };
};
