/**
 * Filename: costCalculator.ts
 * Purpose: Calculate and estimate costs for AI API usage
 * 
 * Key Functions:
 * - estimatePromptCost: Estimate cost before execution
 * - compareCosts: Compare costs across providers
 * - optimizeCost: Suggest cheaper alternatives
 * 
 * Dependencies: pricingData
 */

import { getModelPricing, calculateCost, PRICING_DATA } from '../utils/pricingData';

export interface CostEstimate {
  provider: string;
  model: string;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCost: number;
}

export interface CostComparison {
  current: CostEstimate;
  alternatives: CostEstimate[];
  savings: number;
  recommendation: string;
}

export const estimatePromptCost = (
  prompt: string,
  provider: string,
  model: string,
  expectedOutputLength: number = 500
): CostEstimate | null => {
  const pricing = getModelPricing(provider, model);
  if (!pricing) return null;

  const inputTokens = Math.ceil(prompt.length / 4);
  const outputTokens = Math.ceil(expectedOutputLength / 4);
  const cost = calculateCost(inputTokens, outputTokens, pricing);

  return {
    provider,
    model,
    estimatedInputTokens: inputTokens,
    estimatedOutputTokens: outputTokens,
    estimatedCost: cost
  };
};

export const compareCosts = (
  prompt: string,
  currentProvider: string,
  currentModel: string,
  expectedOutputLength: number = 500
): CostComparison | null => {
  const current = estimatePromptCost(prompt, currentProvider, currentModel, expectedOutputLength);
  if (!current) return null;

  const alternatives: CostEstimate[] = [];

  Object.entries(PRICING_DATA).forEach(([provider, models]) => {
    models.forEach(pricing => {
      if (provider === currentProvider && pricing.model === currentModel) return;
      
      const estimate = estimatePromptCost(prompt, provider, pricing.model, expectedOutputLength);
      if (estimate) alternatives.push(estimate);
    });
  });

  alternatives.sort((a, b) => a.estimatedCost - b.estimatedCost);
  const cheapest = alternatives[0];
  const savings = current.estimatedCost - (cheapest?.estimatedCost || 0);

  let recommendation = 'Current model is cost-effective';
  if (savings > 0.001) {
    recommendation = `Switch to ${cheapest.provider}/${cheapest.model} to save $${savings.toFixed(4)} per request`;
  }

  return {
    current,
    alternatives: alternatives.slice(0, 5),
    savings,
    recommendation
  };
};

export const optimizeCost = (monthlyBudget: number, currentSpending: number): string[] => {
  const suggestions: string[] = [];
  const percentage = (currentSpending / monthlyBudget) * 100;

  if (percentage > 90) {
    suggestions.push('⚠️ Budget almost exhausted! Consider switching to cheaper models');
    suggestions.push('Use GPT-4o-mini or Claude Haiku for simple tasks');
    suggestions.push('Implement prompt caching to reduce input tokens');
  } else if (percentage > 75) {
    suggestions.push('Budget usage is high. Monitor spending closely');
    suggestions.push('Review which prompts consume most tokens');
  } else if (percentage > 50) {
    suggestions.push('On track with budget. Consider optimizing high-cost prompts');
  }

  return suggestions;
};
