export interface StatisticalResult {
  mean: number;
  variance: number;
  stdDev: number;
  confidenceInterval: [number, number];
  sampleSize: number;
}

export function calculateMean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function calculateVariance(values: number[]): number {
  const mean = calculateMean(values);
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
}

export function calculateStdDev(values: number[]): number {
  return Math.sqrt(calculateVariance(values));
}

export function calculateConfidenceInterval(values: number[], confidence = 0.95): [number, number] {
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values);
  const z = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.645;
  const margin = z * (stdDev / Math.sqrt(values.length));
  return [mean - margin, mean + margin];
}

export function calculateZScore(mean1: number, mean2: number, std1: number, std2: number, n1: number, n2: number): number {
  const pooledStd = Math.sqrt((std1 * std1) / n1 + (std2 * std2) / n2);
  return (mean1 - mean2) / pooledStd;
}

export function calculatePValue(zScore: number): number {
  const z = Math.abs(zScore);
  const p = 1 - 0.5 * (1 + erf(z / Math.sqrt(2)));
  return 2 * p;
}

function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export function isStatisticallySignificant(pValue: number, alpha = 0.05): boolean {
  return pValue < alpha;
}

export function calculateSampleSizeNeeded(effect: number, alpha = 0.05, power = 0.8): number {
  const zAlpha = 1.96;
  const zBeta = 0.84;
  return Math.ceil(2 * Math.pow((zAlpha + zBeta) / effect, 2));
}

export function analyzeVariants(variants: { name: string; scores: number[] }[]): {
  results: Record<string, StatisticalResult>;
  winner: string | null;
  comparisons: Array<{ variant1: string; variant2: string; pValue: number; significant: boolean }>;
} {
  const results: Record<string, StatisticalResult> = {};
  
  variants.forEach((v) => {
    results[v.name] = {
      mean: calculateMean(v.scores),
      variance: calculateVariance(v.scores),
      stdDev: calculateStdDev(v.scores),
      confidenceInterval: calculateConfidenceInterval(v.scores),
      sampleSize: v.scores.length,
    };
  });

  const comparisons: Array<{ variant1: string; variant2: string; pValue: number; significant: boolean }> = [];
  for (let i = 0; i < variants.length; i++) {
    for (let j = i + 1; j < variants.length; j++) {
      const v1 = variants[i];
      const v2 = variants[j];
      const r1 = results[v1.name];
      const r2 = results[v2.name];
      const zScore = calculateZScore(r1.mean, r2.mean, r1.stdDev, r2.stdDev, r1.sampleSize, r2.sampleSize);
      const pValue = calculatePValue(zScore);
      comparisons.push({
        variant1: v1.name,
        variant2: v2.name,
        pValue,
        significant: isStatisticallySignificant(pValue),
      });
    }
  }

  const winner = Object.entries(results).reduce((best, [name, result]) =>
    !best || result.mean > results[best].mean ? name : best
  , '');

  return { results, winner, comparisons };
}
