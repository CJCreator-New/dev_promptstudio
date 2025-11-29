import { KeyProvider } from '../../types/apiKeys';

interface VerificationResult {
  valid: boolean;
  error?: string;
  rateLimited?: boolean;
}

const verificationCache = new Map<string, { result: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_DELAY = 2000; // 2 seconds between verifications
let lastVerificationTime = 0;

function getCacheKey(provider: KeyProvider, apiKey: string): string {
  return `${provider}:${apiKey.slice(-8)}`;
}

function checkCache(provider: KeyProvider, apiKey: string): boolean | null {
  const key = getCacheKey(provider, apiKey);
  const cached = verificationCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.result;
  }
  return null;
}

function setCache(provider: KeyProvider, apiKey: string, result: boolean): void {
  const key = getCacheKey(provider, apiKey);
  verificationCache.set(key, { result, timestamp: Date.now() });
}

async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
  const now = Date.now();
  const timeSinceLastVerification = now - lastVerificationTime;
  if (timeSinceLastVerification < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastVerification));
  }
  lastVerificationTime = Date.now();
  return fetch(url, options);
}

export async function verifyOpenAIKey(apiKey: string): Promise<VerificationResult> {
  try {
    const response = await rateLimitedFetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (response.status === 429) {
      return { valid: false, error: 'Rate limited. Please wait a moment.', rateLimited: true };
    }
    return { valid: response.ok, error: response.ok ? undefined : 'Invalid API key' };
  } catch (error) {
    return { valid: false, error: 'Network error. Please check your connection.' };
  }
}

export async function verifyGeminiKey(apiKey: string): Promise<VerificationResult> {
  try {
    const response = await rateLimitedFetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    if (response.status === 429) {
      return { valid: false, error: 'Rate limited. Please wait a moment.', rateLimited: true };
    }
    return { valid: response.ok, error: response.ok ? undefined : 'Invalid API key' };
  } catch (error) {
    return { valid: false, error: 'Network error. Please check your connection.' };
  }
}

export async function verifyClaudeKey(apiKey: string): Promise<VerificationResult> {
  try {
    const response = await rateLimitedFetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      })
    });
    if (response.status === 429) {
      return { valid: false, error: 'Rate limited. Please wait a moment.', rateLimited: true };
    }
    const valid = response.status !== 401 && response.status !== 403;
    return { valid, error: valid ? undefined : 'Invalid API key' };
  } catch (error) {
    return { valid: false, error: 'Network error. Please check your connection.' };
  }
}

export async function verifyOpenRouterKey(apiKey: string): Promise<VerificationResult> {
  try {
    const response = await rateLimitedFetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (response.status === 429) {
      return { valid: false, error: 'Rate limited. Please wait a moment.', rateLimited: true };
    }
    return { valid: response.ok, error: response.ok ? undefined : 'Invalid API key' };
  } catch (error) {
    return { valid: false, error: 'Network error. Please check your connection.' };
  }
}

export async function verifyApiKey(provider: KeyProvider, apiKey: string): Promise<VerificationResult> {
  // Check cache first
  const cached = checkCache(provider, apiKey);
  if (cached !== null) {
    return { valid: cached, error: cached ? undefined : 'Invalid API key (cached)' };
  }

  let result: VerificationResult;
  switch (provider) {
    case 'openai': result = await verifyOpenAIKey(apiKey); break;
    case 'gemini': result = await verifyGeminiKey(apiKey); break;
    case 'claude': result = await verifyClaudeKey(apiKey); break;
    case 'openrouter': result = await verifyOpenRouterKey(apiKey); break;
    default: result = { valid: false, error: 'Unknown provider' };
  }

  // Cache the result
  if (!result.rateLimited) {
    setCache(provider, apiKey, result.valid);
  }

  return result;
}
