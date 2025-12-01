import React from 'react';
import { Variant } from '../services/statisticalAnalysis';
import { calculateMean, calculateConfidenceInterval } from '../utils/statistics';

interface Props {
  variants: Variant[];
  winner: string | null;
}

export const VariantComparison: React.FC<Props> = ({ variants, winner }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {variants.map((variant) => {
        const scores = variant.results.map((r) => r.score);
        const mean = scores.length > 0 ? calculateMean(scores) : 0;
        const [ciLow, ciHigh] = scores.length > 0 ? calculateConfidenceInterval(scores) : [0, 0];
        const isWinner = winner === variant.name;

        return (
          <div
            key={variant.id}
            className={`p-4 rounded-lg border-2 ${
              isWinner ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{variant.name}</h3>
              {isWinner && <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Winner</span>}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mean Score:</span>
                <span className="font-semibold">{mean.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">95% CI:</span>
                <span className="font-mono text-xs">[{ciLow.toFixed(2)}, {ciHigh.toFixed(2)}]</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sample Size:</span>
                <span>{variant.results.length}</span>
              </div>
            </div>

            <div className="bg-gray-100 p-3 rounded text-xs">
              <div className="font-medium mb-1">Prompt:</div>
              <div className="text-gray-700 line-clamp-3">{variant.prompt}</div>
            </div>

            {variant.results.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-1">Score Distribution:</div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden flex">
                  {[1, 2, 3, 4, 5].map((score) => {
                    const count = variant.results.filter((r) => Math.round(r.score) === score).length;
                    const width = (count / variant.results.length) * 100;
                    return (
                      <div
                        key={score}
                        className="bg-blue-500"
                        style={{ width: `${width}%` }}
                        title={`Score ${score}: ${count} results`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
