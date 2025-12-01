/**
 * Filename: pricingData.ts
 * Purpose: Pricing data for AI providers and models
 * 
 * Key Data:
 * - Provider pricing per 1M tokens (input/output)
 * - Model-specific pricing
 * - Cost calculation utilities
 * 
 * Dependencies: None
 */

export interface ModelPricing {
  model: string;
  inputPer1M: number;
  outputPer1M: number;
  provider: string;
}

export const PRICING_DATA: Record<string, ModelPricing[]> = {
  openai: [
    { model: 'gpt-4-turbo', inputPer1M: 10.0, outputPer1M: 30.0, provider: 'openai' },
    { model: 'gpt-4', inputPer1M: 30.0, outputPer1M: 60.0, provider: 'openai' },
    { model: 'gpt-3.5-turbo', inputPer1M: 0.5, outputPer1M: 1.5, provider: 'openai' },
    { model: 'gpt-4o', inputPer1M: 5.0, outputPer1M: 15.0, provider: 'openai' },
    { model: 'gpt-4o-mini', inputPer1M: 0.15, outputPer1M: 0.6, provider: 'openai' }
  ],
  anthropic: [
    { model: 'claude-3-opus', inputPer1M: 15.0, outputPer1M: 75.0, provider: 'anthropic' },
    { model: 'claude-3-sonnet', inputPer1M: 3.0, outputPer1M: 15.0, provider: 'anthropic' },
    { model: 'claude-3-haiku', inputPer1M: 0.25, outputPer1M: 1.25, provider: 'anthropic' },
    { model: 'claude-3.5-sonnet', inputPer1M: 3.0, outputPer1M: 15.0, provider: 'anthropic' }
  ],
  google: [
    { model: 'gemini-pro', inputPer1M: 0.5, outputPer1M: 1.5, provider: 'google' },
    { model: 'gemini-1.5-pro', inputPer1M: 1.25, outputPer1M: 5.0, provider: 'google' },
    { model: 'gemini-1.5-flash', inputPer1M: 0.075, outputPer1M: 0.3, provider: 'google' },
    { model: 'gemini-2.0-flash', inputPer1M: 0.1, outputPer1M: 0.4, provider: 'google' }
  ]
};

export const getModelPricing = (provider: string, model: string): ModelPricing | null => {
  const providerPricing = PRICING_DATA[provider.toLowerCase()];
  if (!providerPricing) return null;
  
  return providerPricing.find(p => 
    model.toLowerCase().includes(p.model.toLowerCase())
  ) || providerPricing[0];
};

export const calculateCost = (
  inputTokens: number,
  outputTokens: number,
  pricing: ModelPricing
): number => {
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPer1M;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPer1M;
  return inputCost + outputCost;
};
