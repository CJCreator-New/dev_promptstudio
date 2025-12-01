import React, { useState } from 'react';
import { Variant, TestResult, StatisticalAnalyzer } from '../services/statisticalAnalysis';
import { VariantComparison } from './VariantComparison';
import { useApiConfigStore } from '../store/apiConfigStore';
import { generateResponse } from '../services/geminiService';

export const ABTestDashboard: React.FC = () => {
  const [variants, setVariants] = useState<Variant[]>([
    { id: 'A', name: 'Variant A', prompt: '', results: [] },
    { id: 'B', name: 'Variant B', prompt: '', results: [] },
  ]);
  const [testInputs, setTestInputs] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const { getActiveApiKey } = useApiConfigStore();
  const analyzer = new StatisticalAnalyzer();

  const analysis = analyzer.analyzeTest(variants);

  const addVariant = () => {
    const id = String.fromCharCode(65 + variants.length);
    setVariants([...variants, { id, name: `Variant ${id}`, prompt: '', results: [] }]);
  };

  const updateVariant = (id: string, field: keyof Variant, value: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const runTest = async () => {
    const apiKey = getActiveApiKey('google');
    if (!apiKey) {
      alert('Please configure Google API key');
      return;
    }

    const inputs = testInputs.split('\n').filter((i) => i.trim());
    if (inputs.length === 0) {
      alert('Please enter test inputs (one per line)');
      return;
    }

    setIsRunning(true);

    for (const variant of variants) {
      if (!variant.prompt.trim()) continue;

      for (const input of inputs) {
        try {
          const fullPrompt = variant.prompt.replace('{{input}}', input);
          const output = await generateResponse(fullPrompt, apiKey);
          const score = Math.random() * 5; // Replace with actual scoring logic

          const result: TestResult = {
            input,
            output,
            score,
            timestamp: Date.now(),
          };

          setVariants((prev) =>
            prev.map((v) => (v.id === variant.id ? { ...v, results: [...v.results, result] } : v))
          );
        } catch (error) {
          console.error(`Error testing variant ${variant.id}:`, error);
        }
      }
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setVariants(variants.map((v) => ({ ...v, results: [] })));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">A/B Test Dashboard</h1>
        <p className="text-gray-600">Compare multiple prompt variants with statistical analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Variants</h2>
            <button
              onClick={addVariant}
              disabled={variants.length >= 4}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              + Add Variant
            </button>
          </div>

          {variants.map((variant) => (
            <div key={variant.id} className="p-4 bg-white border rounded-lg">
              <input
                type="text"
                value={variant.name}
                onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 font-semibold"
                placeholder="Variant name"
              />
              <textarea
                value={variant.prompt}
                onChange={(e) => updateVariant(variant.id, 'prompt', e.target.value)}
                className="w-full px-3 py-2 border rounded h-24"
                placeholder="Enter prompt (use {{input}} for test input)"
              />
              <div className="mt-2 text-sm text-gray-600">
                Results: {variant.results.length} | Avg Score:{' '}
                {variant.results.length > 0
                  ? (variant.results.reduce((sum, r) => sum + r.score, 0) / variant.results.length).toFixed(2)
                  : 'N/A'}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Inputs</h2>
            <textarea
              value={testInputs}
              onChange={(e) => setTestInputs(e.target.value)}
              className="w-full px-3 py-2 border rounded h-40"
              placeholder="Enter test inputs (one per line)"
            />
          </div>

          <button
            onClick={runTest}
            disabled={isRunning}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isRunning ? 'Running Tests...' : '▶ Run A/B Test'}
          </button>

          <button onClick={clearResults} className="w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Clear Results
          </button>
        </div>
      </div>

      {analysis.insights.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold mb-2">Analysis Insights</h3>
          <ul className="space-y-1 text-sm">
            {analysis.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
          {analysis.isComplete && (
            <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-sm text-green-800">
              ✓ Test complete with {analysis.confidence}% confidence
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Variant Comparison</h2>
        <VariantComparison variants={variants} winner={analysis.winner} />
      </div>
    </div>
  );
};
