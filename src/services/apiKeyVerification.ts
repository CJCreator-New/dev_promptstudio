import { ProviderId } from '../store/apiConfigStore';

export async function verifyApiKey(provider: ProviderId, apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    switch (provider) {
      case 'gemini':
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
        return { valid: geminiRes.ok, error: geminiRes.ok ? undefined : 'Invalid or expired key' };
      
      case 'openai':
        const openaiRes = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        return { valid: openaiRes.ok, error: openaiRes.ok ? undefined : 'Invalid key' };
      
      case 'claude':
        const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
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
        const valid = claudeRes.status !== 401 && claudeRes.status !== 403;
        return { valid, error: valid ? undefined : 'Invalid key' };
      
      case 'openrouter':
        const orRes = await fetch('https://openrouter.ai/api/v1/auth/key', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        return { valid: orRes.ok, error: orRes.ok ? undefined : 'Invalid key' };
      
      default:
        return { valid: false, error: 'Unknown provider' };
    }
  } catch (error) {
    return { valid: false, error: 'Network error' };
  }
}
