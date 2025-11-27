import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestTransformer {
  id: string;
  name: string;
  enabled: boolean;
  transform: (request: any) => any;
}

export interface ResponseTransformer {
  id: string;
  name: string;
  enabled: boolean;
  transform: (response: any) => any;
}

export interface CustomEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: CustomHeader[];
  timeout: number;
  retryCount: number;
  requestTransformers: RequestTransformer[];
  responseTransformers: ResponseTransformer[];
  enabled: boolean;
  lastTested?: number;
  testStatus?: 'success' | 'failed' | 'pending';
  createdAt: number;
}

interface CustomEndpointStore {
  endpoints: CustomEndpoint[];
  addEndpoint: (endpoint: Omit<CustomEndpoint, 'id' | 'createdAt'>) => void;
  updateEndpoint: (id: string, updates: Partial<CustomEndpoint>) => void;
  removeEndpoint: (id: string) => void;
  testEndpoint: (id: string) => Promise<boolean>;
  validateUrl: (url: string) => boolean;
  addHeader: (endpointId: string, header: Omit<CustomHeader, 'enabled'>) => void;
  removeHeader: (endpointId: string, headerKey: string) => void;
  addRequestTransformer: (endpointId: string, transformer: RequestTransformer) => void;
  addResponseTransformer: (endpointId: string, transformer: ResponseTransformer) => void;
}

const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

const testEndpoint = async (endpoint: CustomEndpoint): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout);

    const headers: Record<string, string> = {};
    endpoint.headers
      .filter(h => h.enabled)
      .forEach(h => headers[h.key] = h.value);

    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

export const useCustomEndpointStore = create<CustomEndpointStore>()(
  persist(
    (set, get) => ({
      endpoints: [],

      addEndpoint: (endpoint) => {
        const newEndpoint: CustomEndpoint = {
          ...endpoint,
          id: `endpoint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now()
        };
        
        set((state) => ({
          endpoints: [...state.endpoints, newEndpoint]
        }));
      },

      updateEndpoint: (id, updates) => {
        set((state) => ({
          endpoints: state.endpoints.map(e => 
            e.id === id ? { ...e, ...updates } : e
          )
        }));
      },

      removeEndpoint: (id) => {
        set((state) => ({
          endpoints: state.endpoints.filter(e => e.id !== id)
        }));
      },

      testEndpoint: async (id) => {
        const endpoint = get().endpoints.find(e => e.id === id);
        if (!endpoint) return false;

        get().updateEndpoint(id, { testStatus: 'pending' });
        
        const isSuccess = await testEndpoint(endpoint);
        
        get().updateEndpoint(id, {
          testStatus: isSuccess ? 'success' : 'failed',
          lastTested: Date.now()
        });

        return isSuccess;
      },

      validateUrl,

      addHeader: (endpointId, header) => {
        set((state) => ({
          endpoints: state.endpoints.map(e => 
            e.id === endpointId 
              ? { 
                  ...e, 
                  headers: [...e.headers, { ...header, enabled: true }]
                }
              : e
          )
        }));
      },

      removeHeader: (endpointId, headerKey) => {
        set((state) => ({
          endpoints: state.endpoints.map(e => 
            e.id === endpointId 
              ? { 
                  ...e, 
                  headers: e.headers.filter(h => h.key !== headerKey)
                }
              : e
          )
        }));
      },

      addRequestTransformer: (endpointId, transformer) => {
        set((state) => ({
          endpoints: state.endpoints.map(e => 
            e.id === endpointId 
              ? { 
                  ...e, 
                  requestTransformers: [...e.requestTransformers, transformer]
                }
              : e
          )
        }));
      },

      addResponseTransformer: (endpointId, transformer) => {
        set((state) => ({
          endpoints: state.endpoints.map(e => 
            e.id === endpointId 
              ? { 
                  ...e, 
                  responseTransformers: [...e.responseTransformers, transformer]
                }
              : e
          )
        }));
      }
    }),
    { name: 'custom-endpoint-store' }
  )
);