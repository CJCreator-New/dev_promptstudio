import { useState, useEffect, useCallback } from 'react';
import { ProviderId } from '../store/apiConfigStore';
import { fetchModels, ModelInfo } from '../services/modelFetcher';

interface UseModelsResult {
  models: ModelInfo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const modelCache = new Map<string, { models: ModelInfo[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function useModels(providerId: ProviderId | null, apiKey: string | null): UseModelsResult {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndCache = useCallback(async () => {
    if (!providerId || !apiKey) {
      setModels([]);
      return;
    }

    const cacheKey = `${providerId}-${apiKey.slice(0, 10)}`;
    const cached = modelCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setModels(cached.models);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedModels = await fetchModels(providerId, apiKey);
      modelCache.set(cacheKey, { models: fetchedModels, timestamp: Date.now() });
      setModels(fetchedModels);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch models');
      setModels(getFallbackModels(providerId));
    } finally {
      setLoading(false);
    }
  }, [providerId, apiKey]);

  useEffect(() => {
    fetchAndCache();
  }, [fetchAndCache]);

  return { models, loading, error, refetch: fetchAndCache };
}

function getFallbackModels(providerId: ProviderId): ModelInfo[] {
  const fallbacks: Record<ProviderId, ModelInfo[]> = {
    openai: [
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
    ],
    gemini: [
      { id: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' }
    ],
    claude: [
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
      { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
    ],
    openrouter: [
      { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Free)' },
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
      { id: 'openai/gpt-4o', label: 'GPT-4o' }
    ],
    grok: [
      { id: 'grok-beta', label: 'Grok Beta' },
      { id: 'grok-2-latest', label: 'Grok 2 Latest' }
    ]
  };
  
  return fallbacks[providerId] || [];
}
