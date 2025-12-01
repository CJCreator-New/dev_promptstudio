import { EnhancementOptions } from '../types';
import { buildSystemPrompt } from './promptBuilder';
import { FREE_OPENROUTER_MODELS } from '../utils/openRouterModels';

export async function* openRouterStream(
  prompt: string,
  options: EnhancementOptions,
  apiKey: string,
  model?: string
): AsyncGenerator<string, void, unknown> {
  console.log('🔑 OpenRouter key check:', apiKey ? 'Present' : 'Missing', 'Model:', model);
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'DevPrompt Studio',
    },
    body: JSON.stringify({
      model: model || FREE_OPENROUTER_MODELS[0]?.id || 'tng/r1t-chimera:free',
      messages: [
        { role: 'system', content: buildSystemPrompt(options) },
        { role: 'user', content: prompt }
      ],
      stream: true,
    }),
  });

  console.log('📡 OpenRouter response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ OpenRouter error:', errorText);
    
    if (response.status === 402) throw new Error('OpenRouter: No credits. Add credits at openrouter.ai/credits');
    if (response.status === 401) throw new Error('OpenRouter: Invalid API key');
    if (response.status === 429) throw new Error('OpenRouter: Rate limit exceeded');
    if (response.status === 400) throw new Error(`OpenRouter: Bad request - ${errorText}`);
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  if (!response.body) throw new Error('No response body');
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

      for (const line of lines) {
        const data = line.replace('data: ', '').trim();
        if (data === '[DONE]') return;
        if (!data) continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            console.log('✅ OpenRouter chunk received');
            yield content;
          }
        } catch (e) {
          console.error('⚠️ Failed to parse chunk:', data.substring(0, 100));
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
