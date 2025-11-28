import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptData, decryptData } from '../utils/cryptoUtils';
import { KeyProvider, ApiKeyData } from '../types/apiKeys';

interface ApiKeyState {
  keys: Record<KeyProvider, ApiKeyData | null>;
  setKey: (provider: KeyProvider, value: string) => void;
  updateKeyStatus: (provider: KeyProvider, status: ApiKeyData['status']) => void;
  deleteKey: (provider: KeyProvider) => void;
  getKey: (provider: KeyProvider) => string | null;
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
  setItem: async (name: string, value: ApiKeyState) => {
    const serialized = JSON.stringify(value);
    const encrypted = await encryptData(serialized);
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
      setKey: (provider, value) => set((state) => ({
        keys: { 
          ...state.keys, 
          [provider]: { value, status: 'unverified', lastVerified: Date.now() } 
        }
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
    }),
    {
      name: 'user-llm-api-keys',
      storage,
      version: 1,
    }
  )
);
