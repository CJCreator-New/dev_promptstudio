import { useApiKeyStore } from '../store/useApiKeyStore';
import { KeyProvider } from '../types/apiKeys';
import { EnhancementOptions } from '../types';
import { enhancePromptStream } from './geminiService';

export async function* enhancePromptWithKey(
  prompt: string,
  options: EnhancementOptions,
  provider: KeyProvider = 'gemini'
): AsyncGenerator<string, void, unknown> {
  const store = useApiKeyStore.getState();
  const userKey = store.keys[provider];
  
  // Priority: User key (if verified) -> Default key
  if (userKey && userKey.status === 'verified') {
    console.log(`Using user-provided ${provider} key`);
    
    // Temporarily override API key for this request
    const originalKey = process.env.API_KEY;
    process.env.API_KEY = userKey.value;
    
    try {
      yield* enhancePromptStream(prompt, options);
    } finally {
      // Restore original key
      if (originalKey) {
        process.env.API_KEY = originalKey;
      }
    }
  } else {
    // Use default application key
    console.log(`Using default ${provider} key`);
    yield* enhancePromptStream(prompt, options);
  }
}
