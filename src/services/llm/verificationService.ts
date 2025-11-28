import { KeyProvider } from '../../types/apiKeys';

export async function verifyOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function verifyGeminiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function verifyClaudeKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
    return response.status !== 401 && response.status !== 403;
  } catch {
    return false;
  }
}

export async function verifyOpenRouterKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function verifyApiKey(provider: KeyProvider, apiKey: string): Promise<boolean> {
  switch (provider) {
    case 'openai': return verifyOpenAIKey(apiKey);
    case 'gemini': return verifyGeminiKey(apiKey);
    case 'claude': return verifyClaudeKey(apiKey);
    case 'openrouter': return verifyOpenRouterKey(apiKey);
    default: return false;
  }
}
