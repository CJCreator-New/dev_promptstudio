import { ProviderId } from '../store/apiConfigStore';

export async function generateResponse(
  prompt: string,
  providerId: ProviderId,
  modelId: string,
  apiKey: string
): Promise<string> {
  switch (providerId) {
    case 'openai':
      return await generateOpenAI(prompt, modelId, apiKey);
    case 'openrouter':
      return await generateOpenRouter(prompt, modelId, apiKey);
    case 'claude':
      return await generateClaude(prompt, modelId, apiKey);
    case 'gemini':
      return await generateGemini(prompt, modelId, apiKey);
    case 'grok':
      return await generateGrok(prompt, modelId, apiKey);
    default:
      throw new Error(`Unsupported provider: ${providerId}`);
  }
}

async function generateOpenAI(prompt: string, model: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI request failed');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function generateOpenRouter(prompt: string, model: string, apiKey: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenRouter request failed');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function generateClaude(prompt: string, model: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Claude request failed');
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

async function generateGemini(prompt: string, model: string, apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini request failed');
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
}

async function generateGrok(prompt: string, model: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Grok request failed');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}
