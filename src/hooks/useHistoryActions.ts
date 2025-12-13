import { useCallback } from 'react';
import { HistoryItem } from '../types';
import { useAppStore } from '../store';
import { notifySuccess } from '../components/ToastSystem';
import { trackEvent } from '../utils/analytics';

export const useHistoryActions = () => {
  const { setInput, setOptions, resetPrompts } = useAppStore();

  const rerunPrompt = useCallback((item: HistoryItem) => {
    setInput(item.original);
    setOptions({ domain: item.domain, mode: item.mode });
    notifySuccess('Prompt loaded from history');
    trackEvent('prompt_rerun', { prompt_id: item.id });
  }, [setInput, setOptions]);

  const duplicatePrompt = useCallback((item: HistoryItem) => {
    setInput(item.original);
    resetPrompts();
    notifySuccess('Prompt duplicated');
    trackEvent('prompt_duplicated', { prompt_id: item.id });
  }, [setInput, resetPrompts]);

  return { rerunPrompt, duplicatePrompt };
};
