/**
 * Filename: apiConfigStore.ts
 * Purpose: Multi-model API configuration with encrypted storage
 * 
 * Key Features:
 * - Multiple models per provider
 * - Model-specific API keys
 * - Verification status tracking
 * - Backward compatibility with single-key setup
 * 
 * Usage:
 * const { upsertModelConfig, setActiveModel } = useApiConfigStore();
 * upsertModelConfig('openai', { modelId: 'gpt-4', apiKey: 'sk-...', ... });
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'devprompt-studio-key';

export type ProviderId = 'openai' | 'gemini' | 'claude' | 'openrouter' | 'grok';

export interface ProviderModelConfig {
  modelId: string;
  label: string;
  apiKey: string; // Encrypted
  isVerified: boolean;
  lastVerifiedAt?: string;
  isDefault?: boolean;
  verificationError?: string;
}

export interface ProviderConfig {
  providerId: ProviderId;
  models: ProviderModelConfig[];
  activeModelId?: string;
}

export interface ModelListCache {
  models: { id: string; label: string }[];
  fetchedAt: number;
}

interface ApiConfigState {
  providers: Record<ProviderId, ProviderConfig>;
  modelCache: Record<ProviderId, ModelListCache>;
  
  // Provider operations
  setProviderConfig: (id: ProviderId, partial: Partial<ProviderConfig>) => void;
  
  // Model operations
  upsertModelConfig: (id: ProviderId, model: ProviderModelConfig) => void;
  removeModelConfig: (id: ProviderId, modelId: string) => void;
  setActiveModel: (id: ProviderId, modelId: string) => void;
  
  // Verification
  updateVerificationStatus: (
    id: ProviderId,
    modelId: string,
    isVerified: boolean,
    error?: string
  ) => void;
  
  // Model cache
  setModelCache: (id: ProviderId, models: { id: string; label: string }[]) => void;
  getModelCache: (id: ProviderId) => { id: string; label: string }[] | null;
  
  // Helpers
  getActiveConfig: () => { providerId: ProviderId; modelId: string; apiKey: string } | null;
  getActiveApiKey: (providerId: ProviderId) => string | null;
  encryptKey: (key: string) => string;
  decryptKey: (encrypted: string) => string;
}

const encryptKey = (key: string): string => {
  return CryptoJS.AES.encrypt(key, ENCRYPTION_KEY).toString();
};

const decryptKey = (encrypted: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
};

// Migration: Convert old single-key format to new multi-model format
const migrateOldConfig = (oldProviders: any): Record<ProviderId, ProviderConfig> => {
  const newProviders: Record<ProviderId, ProviderConfig> = {
    openai: { providerId: 'openai', models: [] },
    gemini: { providerId: 'gemini', models: [] },
    claude: { providerId: 'claude', models: [] },
    openrouter: { providerId: 'openrouter', models: [] },
    grok: { providerId: 'grok', models: [] }
  };

  if (!oldProviders) return newProviders;

  // Check if old format (single apiKey per provider)
  Object.entries(oldProviders).forEach(([id, config]: [string, any]) => {
    if (config.apiKey && !config.models) {
      // Old format: migrate to new
      const lastVerified = config.lastValidated ? new Date(config.lastValidated).toISOString() : undefined;
      newProviders[id as ProviderId] = {
        providerId: id as ProviderId,
        models: [{
          modelId: config.model || getDefaultModel(id as ProviderId),
          label: config.model || getDefaultModel(id as ProviderId),
          apiKey: config.apiKey,
          isVerified: config.validationStatus === 'valid',
          ...(lastVerified && { lastVerifiedAt: lastVerified }),
          isDefault: true
        }],
        activeModelId: config.model || getDefaultModel(id as ProviderId)
      };
    } else if (config.models) {
      // Already new format
      newProviders[id as ProviderId] = config;
    }
  });

  return newProviders;
};

const getDefaultModel = (providerId: ProviderId): string => {
  const defaults: Record<ProviderId, string> = {
    openai: 'gpt-4o',
    gemini: 'gemini-1.5-flash',
    claude: 'claude-3-5-sonnet-20241022',
    openrouter: 'tng/r1t-chimera:free',
    grok: 'grok-beta'
  };
  return defaults[providerId];
};

export const useApiConfigStore = create<ApiConfigState>()(
  persist(
    (set, get) => ({
      providers: {
        openai: { providerId: 'openai', models: [] },
        gemini: { providerId: 'gemini', models: [] },
        claude: { providerId: 'claude', models: [] },
        openrouter: { providerId: 'openrouter', models: [] },
        grok: { providerId: 'grok', models: [] }
      },
      modelCache: {},

      setProviderConfig: (id: ProviderId, partial: Partial<ProviderConfig>) => set((state: ApiConfigState) => ({
        providers: {
          ...state.providers,
          [id]: { ...state.providers[id], ...partial }
        }
      })),

      upsertModelConfig: (id: ProviderId, model: ProviderModelConfig) => set((state: ApiConfigState) => {
        const provider = state.providers[id];
        const existingIndex = provider.models.findIndex((m: ProviderModelConfig) => m.modelId === model.modelId);
        
        const encryptedModel = {
          ...model,
          apiKey: encryptKey(model.apiKey)
        };

        let newModels;
        if (existingIndex >= 0) {
          newModels = [...provider.models];
          newModels[existingIndex] = encryptedModel;
        } else {
          newModels = [...provider.models, encryptedModel];
        }

        // If this is the first model or marked as default, set as active
        const activeModelId = model.isDefault || newModels.length === 1
          ? model.modelId
          : provider.activeModelId;

        return {
          providers: {
            ...state.providers,
            [id]: {
              ...provider,
              models: newModels,
              activeModelId
            }
          }
        };
      }),

      removeModelConfig: (id: ProviderId, modelId: string) => set((state: ApiConfigState) => {
        const provider = state.providers[id];
        const newModels = provider.models.filter((m: ProviderModelConfig) => m.modelId !== modelId);
        
        // If removing active model, set first available as active
        const activeModelId = provider.activeModelId === modelId
          ? newModels[0]?.modelId
          : provider.activeModelId;

        return {
          providers: {
            ...state.providers,
            [id]: {
              ...provider,
              models: newModels,
              activeModelId
            }
          }
        };
      }),

      setActiveModel: (id: ProviderId, modelId: string) => set((state: ApiConfigState) => ({
        providers: {
          ...state.providers,
          [id]: {
            ...state.providers[id],
            activeModelId: modelId
          }
        }
      })),

      updateVerificationStatus: (id: ProviderId, modelId: string, isVerified: boolean, error?: string) => set((state: ApiConfigState) => {
        const provider = state.providers[id];
        const newModels = provider.models.map((m: ProviderModelConfig) =>
          m.modelId === modelId
            ? {
                ...m,
                isVerified,
                lastVerifiedAt: isVerified ? new Date().toISOString() : m.lastVerifiedAt,
                verificationError: error
              }
            : m
        );

        return {
          providers: {
            ...state.providers,
            [id]: { ...provider, models: newModels }
          }
        };
      }),

      setModelCache: (id: ProviderId, models: { id: string; label: string }[]) => set((state: ApiConfigState) => ({
        modelCache: {
          ...state.modelCache,
          [id]: { models, fetchedAt: Date.now() }
        }
      })),

      getModelCache: (id: ProviderId) => {
        const cache = get().modelCache[id];
        if (!cache) return null;
        
        // Cache valid for 10 minutes
        const isValid = Date.now() - cache.fetchedAt < 10 * 60 * 1000;
        return isValid ? cache.models : null;
      },

      getActiveConfig: () => {
        const state = get();
        
        // Find first provider with active model
        for (const provider of Object.values(state.providers) as ProviderConfig[]) {
          if (provider.activeModelId) {
            const model = provider.models.find((m: ProviderModelConfig) => m.modelId === provider.activeModelId);
            if (model) {
              return {
                providerId: provider.providerId,
                modelId: model.modelId,
                apiKey: decryptKey(model.apiKey)
              };
            }
          }
        }
        
        return null;
      },

      getActiveApiKey: (providerId: ProviderId) => {
        const provider = get().providers[providerId];
        if (!provider?.activeModelId) return null;
        
        const model = provider.models.find((m: ProviderModelConfig) => m.modelId === provider.activeModelId);
        return model ? decryptKey(model.apiKey) : null;
      },

      encryptKey,
      decryptKey
    }),
    {
      name: 'api-config-store',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          return {
            ...persistedState,
            providers: migrateOldConfig(persistedState.providers),
            modelCache: {}
          };
        }
        return persistedState;
      }
    }
  )
);
