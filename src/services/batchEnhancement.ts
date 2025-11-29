import { EnhancementOptions } from '../types';
import { enhancePromptStream } from './geminiService';

export interface BatchResult {
  original: string;
  enhanced: string;
  success: boolean;
  error?: string;
}

export const enhancePromptsBatch = async (
  prompts: string[],
  options: EnhancementOptions,
  batchSize: number = 5
): Promise<BatchResult[]> => {
  const results: BatchResult[] = [];
  
  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (prompt) => {
      try {
        let enhanced = '';
        const stream = enhancePromptStream(prompt, options);
        
        for await (const chunk of stream) {
          enhanced += chunk;
        }
        
        return {
          original: prompt,
          enhanced,
          success: true
        };
      } catch (error: any) {
        return {
          original: prompt,
          enhanced: '',
          success: false,
          error: error.message
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
};
