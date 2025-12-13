import React, { useCallback, useMemo } from 'react';
import { EnhancementOptions, HistoryItem, GenerationMode } from '../../types';
import { KeyProvider } from '../../types/apiKeys';
import { useAppStore, useDataStore } from '../../store';
import { useAuth } from '../../contexts';
import { enhancePromptWithKey } from '../../services/enhancementService';
import { savePromptToCloud } from '../../services/cloudSync';
import { trackEnhancement } from '../../services/firebaseAnalytics';
import { trackEvent } from '../../utils/analytics';
import { withRetry, formatErrorMessage, createErrorContext, logError } from '../../utils/errorHandling';
import { notifySuccess, notifyError, showErrorWithRetry } from '../ToastSystem';
import { useApiKeyStore } from '../../store/useApiKeyStore';

interface UsePromptEnhancementProps {
  input: string;
  options: EnhancementOptions;
  selectedProvider: KeyProvider;
  cloudSyncEnabled: boolean;
  onProviderChange: (provider: KeyProvider) => void;
  onLiveMessage: (message: string) => void;
}

export const usePromptEnhancement = ({
  input,
  options,
  selectedProvider,
  cloudSyncEnabled,
  onProviderChange,
  onLiveMessage,
}: UsePromptEnhancementProps) => {
  const { userId } = useAuth();
  const { setLoading, setOriginalPrompt, setEnhancedPrompt } = useAppStore();
  const { addHistoryItem } = useDataStore();
  const { keys } = useApiKeyStore();

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
      const stream = enhancePromptWithKey(input, options, selectedProvider);
      
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
      onLiveMessage(`${options.mode === GenerationMode.OUTLINE ? 'Outline' : 'Prompt'} generated successfully`);
      
      trackEvent('prompt_enhanced', { 
        mode: options.mode, 
        domain: options.domain, 
        input_length: input.length, 
        output_length: accumulatedText.length 
      });
      
      if (userId && cloudSyncEnabled) {
        try {
          await savePromptToCloud(userId, {
            id: newItem.id,
            original: input,
            enhanced: accumulatedText,
            domain: options.domain,
            mode: options.mode
          });
        } catch (err) {
          console.warn('Cloud sync failed:', err);
        }
      }
      
      if (userId) {
        await trackEnhancement(userId, {
          provider: selectedProvider,
          domain: options.domain,
          mode: options.mode
        });
      }
    }, { maxAttempts: 3, delay: 1000, backoff: true });

    Promise.race([enhancePromise, timeoutPromise])
      .then(() => {
        const perfEnd = performance.now();
        const duration = perfEnd - perfStart;
        console.log(`⚡ Enhancement completed in ${duration.toFixed(2)}ms`);
        notifySuccess(options.mode === GenerationMode.OUTLINE ? "Outline generated!" : "Prompt enhanced!");
      })
      .catch((error: any) => {
        const context = createErrorContext('PromptEnhancementContainer', 'handleEnhance');
        logError(error, context);
        
        const userMessage = formatErrorMessage(error);
        
        if (error.name === 'RateLimitError' || error.message.includes("429") || error.message.includes("402") || error.message.includes("quota") || error.message.includes("credits")) {
          const alternatives = (['openai', 'claude', 'openrouter', 'gemini'] as KeyProvider[])
            .filter(p => p !== selectedProvider && keys[p]?.status === 'verified');
          
          if (alternatives.length > 0 && alternatives[0]) {
            onProviderChange(alternatives[0]);
            notifyError(`${selectedProvider} failed: ${userMessage}. Switched to ${alternatives[0]}. Try again.`);
          } else {
            notifyError(userMessage + ' Add more API keys in Settings.');
          }
        } else if (error.name === 'APIError' || error.message.includes("500") || error.message.includes("503")) {
          showErrorWithRetry(userMessage, handleEnhance);
        } else {
          notifyError(userMessage);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [input, options, selectedProvider, cloudSyncEnabled, userId, setLoading, setOriginalPrompt, setEnhancedPrompt, addHistoryItem, onLiveMessage, onProviderChange, keys]);

  return { handleEnhance };
};
