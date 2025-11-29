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
  
  const apiKey = (userKey && userKey.status === 'verified') 
    ? userKey.value 
    : process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key is missing. Please add your API key in Settings.');
  }
  
  console.log(userKey?.status === 'verified' ? `Using user ${provider} key` : `Using default ${provider} key`);
  
  for await (const chunk of enhancePromptStream(prompt, options, apiKey)) {
    fullResponse += chunk;
    yield chunk;
  }
  responseCache.set(cacheKey, fullResponse);
}
