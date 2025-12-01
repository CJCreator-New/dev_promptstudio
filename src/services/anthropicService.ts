import { EnhancementOptions } from '../types';
import { buildSystemPrompt } from './promptBuilder';

export async function* anthropicStream(
  prompt: string,
  options: EnhancementOptions,
  apiKey: string
): AsyncGenerator<string, void, unknown> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: buildSystemPrompt(options),
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Anthropic: Invalid API key');
    if (response.status === 429) throw new Error('Anthropic: Rate limit exceeded');
    if (response.status === 402) throw new Error('Anthropic: Payment required. Check billing at console.anthropic.com');
    throw new Error(`Anthropic API error: ${response.status}`);
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
        const data = line.replace('data: ', '');

        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta') {
            const content = parsed.delta?.text;
            if (content) yield content;
          }
        } catch {}
      }
    }
  } finally {
    reader.releaseLock();
  }
}
