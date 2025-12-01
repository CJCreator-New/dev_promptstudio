/**
 * Filename: testExecutor.ts
 * Purpose: Execute test cases against AI providers with retry logic
 * 
 * Key Functions:
 * - executeTest: Run a single test case
 * - executeTestSuite: Run all tests in a suite
 * - compareOutputs: Compare expected vs actual output
 * 
 * Dependencies: aiProviderStore, geminiService, openAIService, anthropicService
 */

import { useAIProviderStore } from '../store/aiProviderStore';
import { geminiService } from './geminiService';
import { openAIService } from './openAIService';
import { anthropicService } from './anthropicService';

export interface TestExecutionConfig {
  providerId?: string;
  timeout?: number;
  retries?: number;
  compareMode?: 'exact' | 'contains' | 'similarity';
}

export interface TestExecutionResult {
  actualOutput: string;
  status: 'pass' | 'fail' | 'error';
  errorMessage?: string;
  executionTime: number;
  timestamp: number;
}

const DEFAULT_CONFIG: Required<TestExecutionConfig> = {
  providerId: '',
  timeout: 30000,
  retries: 3,
  compareMode: 'contains'
};

export const executeTest = async (
  prompt: string,
  expectedOutput: string,
  config: TestExecutionConfig = {}
): Promise<TestExecutionResult> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = Date.now();

  try {
    const actualOutput = await executeWithRetry(prompt, finalConfig);
    const status = compareOutputs(actualOutput, expectedOutput, finalConfig.compareMode);
    
    return {
      actualOutput,
      status,
      executionTime: Date.now() - startTime,
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      actualOutput: '',
      status: 'error',
      errorMessage: (error as Error).message,
      executionTime: Date.now() - startTime,
      timestamp: Date.now()
    };
  }
};

const executeWithRetry = async (
  prompt: string,
  config: Required<TestExecutionConfig>,
  attempt = 1
): Promise<string> => {
  try {
    const provider = useAIProviderStore.getState().getActiveProvider();
    if (!provider) {
      throw new Error('No active AI provider configured');
    }

    const apiKey = useAIProviderStore.getState().decryptApiKey(provider.apiKey);
    
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), config.timeout)
    );

    const executePromise = (async () => {
      switch (provider.type) {
        case 'google':
          return await geminiService.generateText(prompt, apiKey, provider.model);
        case 'openai':
          return await openAIService.generateText(prompt, apiKey, provider.model);
        case 'anthropic':
          return await anthropicService.generateText(prompt, apiKey, provider.model);
        default:
          throw new Error(`Unsupported provider type: ${provider.type}`);
      }
    })();

    return await Promise.race([executePromise, timeoutPromise]);
  } catch (error) {
    if (attempt < config.retries) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return executeWithRetry(prompt, config, attempt + 1);
    }
    throw error;
  }
};

const compareOutputs = (
  actual: string,
  expected: string,
  mode: 'exact' | 'contains' | 'similarity'
): 'pass' | 'fail' => {
  const normalizedActual = actual.trim().toLowerCase();
  const normalizedExpected = expected.trim().toLowerCase();

  switch (mode) {
    case 'exact':
      return normalizedActual === normalizedExpected ? 'pass' : 'fail';
    
    case 'contains':
      return normalizedActual.includes(normalizedExpected) || 
             normalizedExpected.includes(normalizedActual) ? 'pass' : 'fail';
    
    case 'similarity':
      const similarity = calculateSimilarity(normalizedActual, normalizedExpected);
      return similarity > 0.7 ? 'pass' : 'fail';
    
    default:
      return 'fail';
  }
};

const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};
