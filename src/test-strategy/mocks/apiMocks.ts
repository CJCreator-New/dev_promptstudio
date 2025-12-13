import { vi } from 'vitest';

// Mock API responses
export const mockEnhancePrompt = vi.fn();
export const mockSaveToCloud = vi.fn();
export const mockFetchHistory = vi.fn();

// Mock streaming response
export const mockStreamingResponse = async function* (text: string) {
  const chunks = text.split(' ');
  for (const chunk of chunks) {
    yield chunk + ' ';
    await new Promise(resolve => setTimeout(resolve, 10));
  }
};

// Mock API service
export const mockApiService = {
  enhancePrompt: mockEnhancePrompt,
  saveToCloud: mockSaveToCloud,
  fetchHistory: mockFetchHistory,
};

// Reset all mocks
export const resetAllMocks = () => {
  mockEnhancePrompt.mockReset();
  mockSaveToCloud.mockReset();
  mockFetchHistory.mockReset();
};

// Mock IndexedDB
export const mockIndexedDB = () => {
  const store: Record<string, any> = {};
  
  return {
    get: vi.fn((key: string) => Promise.resolve(store[key])),
    set: vi.fn((key: string, value: any) => {
      store[key] = value;
      return Promise.resolve();
    }),
    delete: vi.fn((key: string) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
      return Promise.resolve();
    }),
  };
};

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
  };
};
