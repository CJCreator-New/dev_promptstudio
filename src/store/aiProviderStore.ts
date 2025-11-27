import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'devprompt-studio-key';

export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'custom';
  endpoint?: string;
  apiKey: string;
  model: string;
  enabled: boolean;
  isDefault: boolean;
  createdAt: number;
  lastValidated?: number;
  validationStatus?: 'valid' | 'invalid' | 'pending';
}

interface AIProviderStore {
  providers: AIProvider[];
  activeProvider: string | null;
  addProvider: (provider: Omit<AIProvider, 'id' | 'createdAt'>) => Promise<void>;
  updateProvider: (id: string, updates: Partial<AIProvider>) => Promise<void>;
  removeProvider: (id: string) => Promise<void>;
  setActiveProvider: (id: string) => void;
  validateApiKey: (id: string) => Promise<boolean>;
  encryptApiKey: (apiKey: string) => string;
  decryptApiKey: (encryptedKey: string) => string;
  getActiveProvider: () => AIProvider | null;
  setDefaultProvider: (id: string) => void;
}

const encryptApiKey = (apiKey: string): string => {
  return CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
};

const decryptApiKey = (encryptedKey: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
};

const validateApiKey = async (provider: AIProvider): Promise<boolean> => {
  try {
    const decryptedKey = decryptApiKey(provider.apiKey);
    if (!decryptedKey) return false;

    switch (provider.type) {
      case 'openai':
        return decryptedKey.startsWith('sk-');
      case 'anthropic':
        return decryptedKey.startsWith('sk-ant-');
      case 'google':
        return decryptedKey.length > 20;
      case 'custom':
        return decryptedKey.length > 0;
      default:
        return false;
    }
  } catch {
    return false;
  }
};

export const useAIProviderStore = create<AIProviderStore>()(
  persist(
    (set, get) => ({
      providers: [],
      activeProvider: null,
      
      addProvider: async (provider) => {
        const encryptedApiKey = encryptApiKey(provider.apiKey);
        const newProvider: AIProvider = {
          ...provider,
          id: `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          apiKey: encryptedApiKey,
          createdAt: Date.now(),
          validationStatus: 'pending'
        };
        
        set((state) => {
          const providers = [...state.providers, newProvider];
          // Set as default if it's the first provider or explicitly requested
          if (providers.length === 1 && !provider.isDefault) {
            newProvider.isDefault = true;
          }
          return { providers };
        });
        
        const isValid = await validateApiKey(newProvider);
        await get().updateProvider(newProvider.id, {
          validationStatus: isValid ? 'valid' : 'invalid',
          lastValidated: Date.now()
        });
      },
      
      updateProvider: async (id, updates) => {
        set((state) => {
          const updatedProvider = { ...updates };
          if (updates.apiKey) {
            updatedProvider.apiKey = encryptApiKey(updates.apiKey);
            updatedProvider.validationStatus = 'pending';
          }
          
          return {
            providers: state.providers.map(p => 
              p.id === id ? { ...p, ...updatedProvider } : p
            )
          };
        });
        
        if (updates.apiKey) {
          const provider = get().providers.find(p => p.id === id);
          if (provider) {
            const isValid = await validateApiKey(provider);
            set((state) => ({
              providers: state.providers.map(p => 
                p.id === id ? {
                  ...p,
                  validationStatus: isValid ? 'valid' : 'invalid',
                  lastValidated: Date.now()
                } : p
              )
            }));
          }
        }
      },
      
      removeProvider: async (id) => {
        set((state) => {
          const remainingProviders = state.providers.filter(p => p.id !== id);
          const removedProvider = state.providers.find(p => p.id === id);
          
          if (removedProvider?.isDefault && remainingProviders.length > 0) {
            remainingProviders[0].isDefault = true;
          }
          
          return {
            providers: remainingProviders,
            activeProvider: state.activeProvider === id ? 
              (remainingProviders[0]?.id || null) : state.activeProvider
          };
        });
      },
      
      setActiveProvider: (id) => set({ activeProvider: id }),
      
      validateApiKey: async (id) => {
        const provider = get().providers.find(p => p.id === id);
        if (!provider) return false;
        
        const isValid = await validateApiKey(provider);
        set((state) => ({
          providers: state.providers.map(p => 
            p.id === id ? {
              ...p,
              validationStatus: isValid ? 'valid' : 'invalid',
              lastValidated: Date.now()
            } : p
          )
        }));
        
        return isValid;
      },
      
      encryptApiKey,
      decryptApiKey,
      
      getActiveProvider: () => {
        const state = get();
        return state.providers.find(p => p.id === state.activeProvider) || 
               state.providers.find(p => p.isDefault) || 
               state.providers[0] || null;
      },
      
      setDefaultProvider: (id) => {
        set((state) => ({
          providers: state.providers.map(p => ({
            ...p,
            isDefault: p.id === id
          }))
        }));
      }
    }),
    { name: 'ai-provider-store' }
  )
);