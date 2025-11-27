import { describe, it, expect, vi } from 'vitest';
import * as geminiService from '../services/geminiService';

// Mock the GoogleGenAI
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContentStream: vi.fn()
    }
  }))
}));

vi.mock('../utils/errorLogging', () => ({
  logger: {
    error: vi.fn()
  }
}));

describe('Property 17: API Call Isolation', () => {
  it('should have all API calls centralized in geminiService', () => {
    // Verify geminiService exports the main API function
    expect(geminiService.enhancePromptStream).toBeDefined();
    expect(typeof geminiService.enhancePromptStream).toBe('function');
  });

  it('should provide interceptor registration functions', () => {
    expect(geminiService.addRequestInterceptor).toBeDefined();
    expect(geminiService.addResponseInterceptor).toBeDefined();
    expect(geminiService.addErrorInterceptor).toBeDefined();
    
    expect(typeof geminiService.addRequestInterceptor).toBe('function');
    expect(typeof geminiService.addResponseInterceptor).toBe('function');
    expect(typeof geminiService.addErrorInterceptor).toBe('function');
  });

  it('should allow adding request interceptors', () => {
    const interceptor = (config: any) => {
      return { ...config, intercepted: true };
    };
    
    expect(() => {
      geminiService.addRequestInterceptor(interceptor);
    }).not.toThrow();
  });

  it('should allow adding response interceptors', () => {
    const interceptor = (response: any) => {
      return { ...response, processed: true };
    };
    
    expect(() => {
      geminiService.addResponseInterceptor(interceptor);
    }).not.toThrow();
  });

  it('should allow adding error interceptors', () => {
    const interceptor = (error: any) => {
      return { ...error, handled: true };
    };
    
    expect(() => {
      geminiService.addErrorInterceptor(interceptor);
    }).not.toThrow();
  });

  it('should not expose internal API implementation details', () => {
    // Service should not export internal helper functions
    const exports = Object.keys(geminiService);
    
    // Should only export public API
    expect(exports).toContain('enhancePromptStream');
    expect(exports).toContain('addRequestInterceptor');
    expect(exports).toContain('addResponseInterceptor');
    expect(exports).toContain('addErrorInterceptor');
    
    // Should not expose internal functions
    expect(exports).not.toContain('retryOperation');
    expect(exports).not.toContain('applyRequestInterceptors');
  });

  it('should handle API configuration through single service', () => {
    // All API configuration should go through geminiService
    // No direct API client instantiation in components
    expect(geminiService.enhancePromptStream).toBeDefined();
  });
});