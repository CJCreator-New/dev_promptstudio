import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptData, decryptData } from '../utils/cryptoUtils';
import { KeyProvider, ApiKeyData } from '../types/apiKeys';

interface ApiKeyState {
  keys: Record<KeyProvider, ApiKeyData | null>;
  models: Record<KeyProvider, string>;
  setKey: (provider: KeyProvider, value: string, model?: string) => void;
  setModel: (provider: KeyProvider, model: string) => void;
  updateKeyStatus: (provider: KeyProvider, status: ApiKeyData['status']) => void;
  deleteKey: (provider: KeyProvider) => void;
  getKey: (provider: KeyProvider) => string | null;
  getModel: (provider: KeyProvider) => string;
}

const storage = createJSONStorage<ApiKeyState>(() => ({
  getItem: async (name: string) => {
    const encrypted = localStorage.getItem(name);
    if (!encrypted) return null;
    try {
      const decrypted = await decryptData(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    const encrypted = await encryptData(value);
    localStorage.setItem(name, encrypted);
  },
  removeItem: (name: string) => localStorage.removeItem(name),
}));

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      keys: {
        openai: null,
        gemini: null,
        claude: null,
        openrouter: null,
      },
      models: {
        openai: 'gpt-4o',
        gemini: 'gemini-2.0-flash-exp',
        claude: 'claude-3-5-sonnet-20241022',
        openrouter: 'google/gemini-2.0-flash-exp:free',
      },
      setKey: (provider, value, model) => set((state) => ({
        keys: { 
          ...state.keys, 
          [provider]: { value, status: 'unverified', lastVerified: Date.now() } 
        },
        models: model ? { ...state.models, [provider]: model } : state.models
      })),
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
      deleteKey: (provider) => set((state) => ({
        keys: { ...state.keys, [provider]: null }
      })),
      getKey: (provider) => get().keys[provider]?.value || null,
      getModel: (provider) => get().models[provider],
    }),
    {
      name: 'user-llm-api-keys',
      storage,
      version: 1,
    }
  )
);
