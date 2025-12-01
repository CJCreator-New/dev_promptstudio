import { EnhancementOptions } from '../types';
import { buildSystemPrompt } from './promptBuilder';

export async function* openAIStream(
  prompt: string,
  options: EnhancementOptions,
  apiKey: string
): AsyncGenerator<string, void, unknown> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: buildSystemPrompt(options) },
        { role: 'user', content: prompt }
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('OpenAI: Invalid API key');
    if (response.status === 429) throw new Error('OpenAI: Rate limit or quota exceeded');
    if (response.status === 402) throw new Error('OpenAI: Payment required. Check billing at platform.openai.com');
    throw new Error(`OpenAI API error: ${response.status}`);
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
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {}
      }
    }
  } finally {
    reader.releaseLock();
  }
}
