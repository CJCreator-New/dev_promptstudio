import { useApiKeyStore } from '../store/useApiKeyStore';
import { KeyProvider } from '../types/apiKeys';
import { EnhancementOptions } from '../types';
import { enhancePromptStream } from './geminiService';
import { LRUCache, hashPrompt } from '../utils/lruCache';

const responseCache = new LRUCache<string, string>(50);

export async function* enhancePromptWithKey(
  prompt: string,
  options: EnhancementOptions,
  provider: KeyProvider = 'gemini'
): AsyncGenerator<string, void, unknown> {
  const cacheKey = hashPrompt(prompt + JSON.stringify(options));
  const cached = responseCache.get(cacheKey);
  
  if (cached) {
    console.log('💾 Cache hit for prompt');
    yield cached;
    return;
  }
  
  let fullResponse = '';
  const store = useApiKeyStore.getState();
  const userKey = store.keys[provider];
  
  // Priority: User key (if verified) -> Default key
  if (userKey && userKey.status === 'verified') {
    console.log(`Using user-provided ${provider} key`);
    
    // Temporarily override API key for this request
    const originalKey = process.env.API_KEY;
    process.env.API_KEY = userKey.value;
    
    try {
      for await (const chunk of enhancePromptStream(prompt, options)) {
        fullResponse += chunk;
        yield chunk;
      }
      responseCache.set(cacheKey, fullResponse);
    } finally {
      // Restore original key
      if (originalKey) {
        process.env.API_KEY = originalKey;
      }
    }
  } else {
    // Use default application key
    console.log(`Using default ${provider} key`);
    for await (const chunk of enhancePromptStream(prompt, options)) {
      fullResponse += chunk;
      yield chunk;
    }
    responseCache.set(cacheKey, fullResponse);
  }
}
