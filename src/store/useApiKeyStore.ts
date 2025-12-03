import { create } from 'zustand';
import { secureStorage } from '../utils/secureStorage';
import { KeyProvider, ApiKeyData } from '../types/apiKeys';

interface ApiKeyState {
  keys: Record<KeyProvider, ApiKeyData | null>;
  models: Record<KeyProvider, string>;
  setKey: (provider: KeyProvider, value: string, model?: string) => Promise<void>;
  setModel: (provider: KeyProvider, model: string) => void;
  updateKeyStatus: (provider: KeyProvider, status: ApiKeyData['status']) => void;
  deleteKey: (provider: KeyProvider) => Promise<void>;
  getKey: (provider: KeyProvider) => string | null;
  getModel: (provider: KeyProvider) => string;
}

// Load keys from secure storage on init
const loadInitialKeys = async (): Promise<Record<KeyProvider, ApiKeyData | null>> => {
  const providers: KeyProvider[] = ['openai', 'gemini', 'claude', 'openrouter'];
  const keys: Record<KeyProvider, ApiKeyData | null> = {
    openai: null,
    gemini: null,
    claude: null,
    openrouter: null,
  };
  
  for (const provider of providers) {
    const value = await secureStorage.getApiKey(provider);
    if (value) {
      keys[provider] = { value, status: 'verified', lastVerified: Date.now() };
    }
  }
  
  return keys;
};

export const useApiKeyStore = create<ApiKeyState>()((set, get) => ({
  keys: {
    openai: null,
    gemini: null,
    claude: null,
    openrouter: null,
  },
  models: {
    openai: 'gpt-4o',
    gemini: 'gemini-1.5-flash',
    claude: 'claude-3-5-sonnet-20241022',
    openrouter: 'tng/r1t-chimera:free',
  },
  setKey: async (provider, value, model) => {
    await secureStorage.setApiKey(provider, value);
    set((state) => ({
      keys: { 
        ...state.keys, 
        [provider]: { value, status: 'unverified', lastVerified: Date.now() } 
      },
      models: model ? { ...state.models, [provider]: model } : state.models
    }));
  },
  setModel: (provider, model) => set((state) => ({
    models: { ...state.models, [provider]: model }
  })),
  updateKeyStatus: (provider, status) => set((state) => {
    const currentKey = state.keys[provider];
    if (!currentKey) return state;
    return { 
      keys: { 
        ...state.keys, 
        [provider]: { ...currentKey, status, lastVerified: Date.now() } 
      } 
    };
  }),
  deleteKey: async (provider) => {
    await secureStorage.removeApiKey(provider);
    set((state) => ({
      keys: { ...state.keys, [provider]: null }
    }));
  },
  getKey: (provider) => get().keys[provider]?.value || null,
  getModel: (provider) => get().models[provider],
}));

// Load keys from secure storage on init
loadInitialKeys().then(keys => {
  useApiKeyStore.setState({ keys });
});
