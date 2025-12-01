import { analyzeVariants, calculateSampleSizeNeeded } from '../utils/statistics';

export interface Variant {
  id: string;
  name: string;
  prompt: string;
  results: TestResult[];
}

export interface TestResult {
  input: string;
  output: string;
  score: number;
  timestamp: number;
  tokens?: number;
  cost?: number;
}

export interface ABTestAnalysis {
  variants: Variant[];
  winner: string | null;
  confidence: number;
  recommendedSampleSize: number;
  isComplete: boolean;
  insights: string[];
}

export class StatisticalAnalyzer {
  analyzeTest(variants: Variant[], minSampleSize = 30, alpha = 0.05): ABTestAnalysis {
    const variantData = variants.map((v) => ({
      name: v.name,
      scores: v.results.map((r) => r.score),
    }));

    const { results, winner, comparisons } = analyzeVariants(variantData);
    
    const allSamplesSufficient = variants.every((v) => v.results.length >= minSampleSize);
    const hasSignificantDifference = comparisons.some((c) => c.significant);
    
    const insights: string[] = [];
    
    if (!allSamplesSufficient) {
      const minResults = Math.min(...variants.map((v) => v.results.length));
      insights.push(`Need ${minSampleSize - minResults} more samples for statistical significance`);
    }
    
    if (hasSignificantDifference && winner) {
      const winnerResult = results[winner];
      insights.push(`${winner} is statistically significant winner (mean: ${winnerResult.mean.toFixed(2)})`);
    } else if (allSamplesSufficient) {
      insights.push('No statistically significant difference detected between variants');
    }
    
    const maxMean = Math.max(...Object.values(results).map((r) => r.mean));
    const minMean = Math.min(...Object.values(results).map((r) => r.mean));
    const effectSize = (maxMean - minMean) / Math.max(...Object.values(results).map((r) => r.stdDev));
    
    const recommendedSampleSize = calculateSampleSizeNeeded(effectSize || 0.5, alpha);
    
    comparisons.forEach((c) => {
      if (c.significant) {
        insights.push(`${c.variant1} vs ${c.variant2}: p-value = ${c.pValue.toFixed(4)} (significant)`);
      }
    });

    return {
      variants,
      winner: hasSignificantDifference ? winner : null,
      confidence: hasSignificantDifference ? (1 - alpha) * 100 : 0,
      recommendedSampleSize,
      isComplete: allSamplesSufficient && hasSignificantDifference,
      insights,
    };
  }

  calculateMetrics(variant: Variant) {
    const scores = variant.results.map((r) => r.score);
    const tokens = variant.results.map((r) => r.tokens || 0);
    const costs = variant.results.map((r) => r.cost || 0);
    
    return {
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length || 0,
      avgTokens: tokens.reduce((a, b) => a + b, 0) / tokens.length || 0,
      avgCost: costs.reduce((a, b) => a + b, 0) / costs.length || 0,
      totalTests: variant.results.length,
    };
  }
}
