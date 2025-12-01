/**
 * Filename: modelFetcher.ts
 * Purpose: Fetch available models from AI providers
 * 
 * Key Functions:
 * - fetchModels: Get model list from provider API
 * - verifyModel: Test model with minimal request
 * 
 * Usage:
 * const models = await fetchModels('openai', apiKey);
 * const isValid = await verifyModel('openai', 'gpt-4', apiKey);
 */

import { ProviderId } from '../store/apiConfigStore';

export interface ModelInfo {
  id: string;
  label: string;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status === 401 || response.status === 403) {
        return response;
      }
      if (i < retries - 1 && (response.status === 429 || response.status >= 500)) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}

export const fetchModels = async (
  providerId: ProviderId,
  apiKey: string
): Promise<ModelInfo[]> => {
  try {
    switch (providerId) {
      case 'openai':
        return await fetchOpenAIModels(apiKey);
      case 'openrouter':
        return await fetchOpenRouterModels(apiKey);
      case 'claude':
        return getClaudeModels();
      case 'gemini':
        return getGeminiModels();
      case 'grok':
        return getGrokModels();
      default:
        return [];
    }
  } catch (error) {
    console.error(`Failed to fetch models for ${providerId}:`, error);
    throw error;
  }
};

const fetchOpenAIModels = async (apiKey: string): Promise<ModelInfo[]> => {
  const response = await fetchWithRetry('https://api.openai.com/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Failed to fetch OpenAI models (${response.status})`);
  }

  const data = await response.json();
  return data.data
    .filter((m: any) => m.id.includes('gpt'))
    .map((m: any) => ({ id: m.id, label: m.id }))
    .sort((a: ModelInfo, b: ModelInfo) => b.id.localeCompare(a.id));
};

const fetchOpenRouterModels = async (apiKey: string): Promise<ModelInfo[]> => {
  const response = await fetchWithRetry('https://openrouter.ai/api/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://devprompt.studio'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Failed to fetch OpenRouter models (${response.status})`);
  }

  const data = await response.json();
  return data.data.map((m: any) => ({
    id: m.id,
    label: m.name || m.id
  }));
};

const getClaudeModels = (): ModelInfo[] => [
  { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
  { id: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
  { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
];

const getGeminiModels = (): ModelInfo[] => [
  { id: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash' },
  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  { id: 'gemini-pro', label: 'Gemini Pro' }
];

const getGrokModels = (): ModelInfo[] => [
  { id: 'grok-beta', label: 'Grok Beta' },
  { id: 'grok-2-latest', label: 'Grok 2 Latest' },
  { id: 'grok-2-1212', label: 'Grok 2 (12/12)' }
];

export const verifyModel = async (
  providerId: ProviderId,
  modelId: string,
  apiKey: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    switch (providerId) {
      case 'openai':
        await verifyOpenAI(modelId, apiKey);
        break;
      case 'openrouter':
        await verifyOpenRouter(modelId, apiKey);
        break;
      case 'claude':
        await verifyClaude(modelId, apiKey);
        break;
      case 'gemini':
        await verifyGemini(modelId, apiKey);
        break;
      case 'grok':
        await verifyGrok(modelId, apiKey);
        break;
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const verifyOpenAI = async (model: string, apiKey: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 5
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Verification failed');
  }
};

const verifyOpenRouter = async (model: string, apiKey: string) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 5
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Verification failed');
  }
};

const verifyClaude = async (model: string, apiKey: string) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 5
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Verification failed');
  }
};

const verifyGemini = async (model: string, apiKey: string) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hi' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Verification failed');
  }
};

const verifyGrok = async (model: string, apiKey: string) => {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 5
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Verification failed');
  }
};
