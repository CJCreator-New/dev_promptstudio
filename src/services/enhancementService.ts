import { useApiConfigStore } from '../store/apiConfigStore';
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
  const newStore = useApiConfigStore.getState();
  const oldStore = useApiKeyStore.getState();
  
  console.log('🔍 DEBUG: Checking stores...');
  console.log('New store providers:', newStore.providers[provider]);
  console.log('Old store keys:', oldStore.keys[provider]);
  
  let apiKey = newStore.getActiveApiKey(provider);
  let model = newStore.providers[provider]?.activeModelId;
  
  console.log('🔍 New store key:', apiKey ? 'Found' : 'Not found');
  
  if (!apiKey) {
    apiKey = oldStore.getKey(provider);
    model = oldStore.getModel(provider);
    console.log('🔍 Old store key:', apiKey ? 'Found' : 'Not found');
  }
  
  if (!apiKey) {
    throw new Error(`${provider} API Key is missing. Please add and verify your API key in Settings.`);
  }
  
  console.log(`🔑 Using ${provider} key (length: ${apiKey.length})`);
  console.log('📋 Provider:', provider, 'Key exists:', !!apiKey);
  console.log('🎯 Selected model:', model);
  
  let stream: AsyncGenerator<string, void, unknown>;
  
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
