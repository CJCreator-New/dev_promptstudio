import { useApiKeyStore } from '../store/useApiKeyStore';
import { KeyProvider } from '../types/apiKeys';
import { EnhancementOptions } from '../types';
import { enhancePromptStream } from './geminiService';
import { openRouterStream } from './openRouterService';
import { openAIStream } from './openAIService';
import { anthropicStream } from './anthropicService';
import { LRUCache, hashPrompt } from '../utils/lruCache';

const responseCache = new LRUCache<string, string>(50);

export async function* enhancePromptWithKey(
  prompt: string,
  options: EnhancementOptions,
  provider: KeyProvider = 'gemini'
): AsyncGenerator<string, void, unknown> {
  const cacheKey = hashPrompt(prompt + JSON.stringify(options) + provider);
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
    : (provider === 'gemini' ? process.env.API_KEY : undefined);
  
  if (!apiKey) {
    throw new Error(`${provider} API Key is missing. Please add your API key in Settings.`);
  }
  
  console.log(`🔑 Using ${userKey?.status === 'verified' ? 'user' : 'default'} ${provider} key`);
  
  let stream: AsyncGenerator<string, void, unknown>;
  
  const model = store.getModel(provider);
  
  switch (provider) {
    case 'openrouter':
      stream = openRouterStream(prompt, options, apiKey, model);
      break;
    case 'openai':
      stream = openAIStream(prompt, options, apiKey);
      break;
    case 'claude':
      stream = anthropicStream(prompt, options, apiKey);
      break;
    case 'gemini':
    default:
      stream = enhancePromptStream(prompt, options, apiKey);
      break;
  }
  
  for await (const chunk of stream) {
    fullResponse += chunk;
    yield chunk;
  }
  
  responseCache.set(cacheKey, fullResponse);
}
