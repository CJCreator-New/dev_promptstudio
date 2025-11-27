import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhancePromptStream, addRequestInterceptor, addResponseInterceptor, addErrorInterceptor } from '../services/geminiService';
import { DomainType, GenerationMode } from '../types';

const mockGenerateContentStream = vi.fn();

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContentStream: mockGenerateContentStream
    }
  }))
}));

vi.mock('../utils/errorLogging', () => ({
  logger: {
    error: vi.fn()
  }
}));

const mockOptions = {
  domain: DomainType.FRONTEND,
  mode: GenerationMode.PROMPT,
  targetTool: 'general',
  complexity: 'intermediate' as any,
  platform: 'web' as any,
  includeTechStack: false,
  includeBestPractices: false,
  includeEdgeCases: false,
  includeCodeSnippet: false,
  includeExampleUsage: false,
  includeTests: false,
  useThinking: false
};

describe('API Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_KEY = 'test-api-key';
  });

  describe('Request Formatting', () => {
    it('should format request with correct model name', async () => {
      mockGenerateContentStream.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield { text: 'response' };
        }
      });

      const generator = enhancePromptStream('test input', mockOptions);
      await generator.next();

      expect(mockGenerateContentStream).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash'
        })
      );
    });

    it('should use thinking model when useThinking is true', async () => {
      mockGenerateContentStream.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield { text: 'response' };
        }
      });

      const thinkingOptions = { ...mockOptions, useThinking: true };
      const generator = enhancePromptStream('test input', thinkingOptions);
      await generator.next();

      expect(mockGenerateContentStream).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-3-pro-preview'
        })
      );
    });

    it('should include system instruction in request', async () => {
      mockGenerateContentStream.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield { text: 'response' };
        }
      });

      const generator = enhancePromptStream('test input', mockOptions);
      await generator.next();

      expect(mockGenerateContentStream).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            systemInstruction: expect.stringContaining('DevPrompt Studio')
          })
        })
      );
    });
  });

  describe('Response Parsing', () => {
    it('should yield text chunks from stream', async () => {
      mockGenerateContentStream.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield { text: 'chunk1' };
          yield { text: 'chunk2' };
          yield { text: 'chunk3' };
        }
      });

      const generator = enhancePromptStream('test input', mockOptions);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['chunk1', 'chunk2', 'chunk3']);
    });

    it('should skip chunks without text', async () => {
      mockGenerateContentStream.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield { text: 'chunk1' };
          yield { metadata: 'some data' };
          yield { text: 'chunk2' };
        }
      });

      const generator = enhancePromptStream('test input', mockOptions);
      const chunks: string[] = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['chunk1', 'chunk2']);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when API key is missing', async () => {
      delete process.env.API_KEY;

      const generator = enhancePromptStream('test input', mockOptions);

      await expect(async () => {
        await generator.next();
      }).rejects.toThrow(/API Key is missing/);
    });

    it('should handle 429 rate limit errors', async () => {
      const error = new Error('Rate limit exceeded');
      (error as any).status = 429;
      mockGenerateContentStream.mockRejectedValue(error);

      const generator = enhancePromptStream('test input', mockOptions);

      await expect(async () => {
        for await (const _ of generator) {
          // consume generator
        }
      }).rejects.toThrow(/Too Many Requests/);
    });

    it('should handle 500 server errors', async () => {
      const error = new Error('Internal server error');
      (error as any).status = 500;
      mockGenerateContentStream.mockRejectedValue(error);

      const generator = enhancePromptStream('test input', mockOptions);

      await expect(async () => {
        for await (const _ of generator) {
          // consume generator
        }
      }).rejects.toThrow(/Internal Server Error/);
    });

    it('should handle network errors', async () => {
      const error = new Error('Network request failed');
      mockGenerateContentStream.mockRejectedValue(error);

      const generator = enhancePromptStream('test input', mockOptions);

      await expect(async () => {
        for await (const _ of generator) {
          // consume generator
        }
      }).rejects.toThrow(/Network Error/);
    });
  });

  describe('Retry Logic', () => {
    it('should retry on 429 errors', async () => {
      vi.useFakeTimers();
      
      const error = new Error('Rate limit');
      (error as any).status = 429;
      
      mockGenerateContentStream
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({
          [Symbol.asyncIterator]: async function* () {
            yield { text: 'success' };
          }
        });

      const generator = enhancePromptStream('test input', mockOptions);
      const promise = generator.next();

      // Fast-forward through retry delays
      await vi.runAllTimersAsync();

      const result = await promise;
      expect(result.value).toBe('success');
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(3);

      vi.useRealTimers();
    });

    it('should retry on 503 errors', async () => {
      vi.useFakeTimers();
      
      const error = new Error('Service unavailable');
      (error as any).status = 503;
      
      mockGenerateContentStream
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({
          [Symbol.asyncIterator]: async function* () {
            yield { text: 'success' };
          }
        });

      const generator = enhancePromptStream('test input', mockOptions);
      const promise = generator.next();

      await vi.runAllTimersAsync();

      const result = await promise;
      expect(result.value).toBe('success');
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should use exponential backoff for retries', async () => {
      vi.useFakeTimers();
      const { logger } = await import('../utils/errorLogging');
      
      const error = new Error('Temporary error');
      (error as any).status = 503;
      
      mockGenerateContentStream.mockRejectedValue(error);

      const generator = enhancePromptStream('test input', mockOptions);
      const promise = generator.next().catch(() => {});

      await vi.runAllTimersAsync();
      await promise;

      // Check that delays increased exponentially
      const logCalls = vi.mocked(logger.error).mock.calls;
      expect(logCalls.length).toBeGreaterThan(0);
      
      // Verify retry delays: 1000ms, 2000ms, 4000ms
      const delays = logCalls.map(call => call[1]?.nextRetryDelay).filter(Boolean);
      expect(delays[0]).toBe(1000);
      if (delays[1]) expect(delays[1]).toBe(2000);
      if (delays[2]) expect(delays[2]).toBe(4000);

      vi.useRealTimers();
    });

    it('should stop retrying after max attempts', async () => {
      vi.useFakeTimers();
      
      const error = new Error('Persistent error');
      (error as any).status = 503;
      
      mockGenerateContentStream.mockRejectedValue(error);

      const generator = enhancePromptStream('test input', mockOptions);
      const promise = generator.next();

      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow();
      
      // Should try initial + 3 retries = 4 total
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(4);

      vi.useRealTimers();
    });
  });

  describe('Interceptors', () => {
    it('should apply request interceptors', async () => {
      const interceptor = vi.fn((config) => ({
        ...config,
        intercepted: true
      }));

      addRequestInterceptor(interceptor);

      mockGenerateContentStream.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield { text: 'response' };
        }
      });

      const generator = enhancePromptStream('test input', mockOptions);
      await generator.next();

      expect(interceptor).toHaveBeenCalled();
    });

    it('should apply response interceptors', async () => {
      const interceptor = vi.fn((response) => ({
        ...response,
        processed: true
      }));

      addResponseInterceptor(interceptor);

      mockGenerateContentStream.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield { text: 'response' };
        }
      });

      const generator = enhancePromptStream('test input', mockOptions);
      await generator.next();

      expect(interceptor).toHaveBeenCalled();
    });

    it('should apply error interceptors', async () => {
      const interceptor = vi.fn((error) => ({
        ...error,
        handled: true
      }));

      addErrorInterceptor(interceptor);

      const error = new Error('Test error');
      (error as any).status = 400;
      mockGenerateContentStream.mockRejectedValue(error);

      const generator = enhancePromptStream('test input', mockOptions);

      await expect(async () => {
        for await (const _ of generator) {}
      }).rejects.toThrow();

      expect(interceptor).toHaveBeenCalled();
    });
  });
});