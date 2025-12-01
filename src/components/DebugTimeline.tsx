import React from 'react';
import { DebugStep } from '../store/debugStore';

interface Props {
  steps: DebugStep[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

export const DebugTimeline: React.FC<Props> = ({ steps, currentStepIndex, onStepClick }) => {
  const getStepIcon = (type: DebugStep['type']) => {
    switch (type) {
      case 'prompt': return '📝';
      case 'tool_call': return '🔧';
      case 'response': return '💬';
      case 'error': return '❌';
    }
  };

  const getStepColor = (type: DebugStep['type']) => {
    switch (type) {
      case 'prompt': return 'bg-blue-100 border-blue-500';
      case 'tool_call': return 'bg-yellow-100 border-yellow-500';
      case 'response': return 'bg-green-100 border-green-500';
      case 'error': return 'bg-red-100 border-red-500';
    }
  };

  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div
          key={step.id}
          onClick={() => onStepClick(index)}
          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
            index === currentStepIndex ? 'ring-2 ring-blue-500' : ''
          } ${getStepColor(step.type)}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{getStepIcon(step.type)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm capitalize">{step.type.replace('_', ' ')}</span>
                <span className="text-xs text-gray-500">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 line-clamp-2 mb-2">{step.content}</div>
              
              {step.toolName && (
                <div className="text-xs text-gray-600 mb-1">
                  Tool: <span className="font-mono">{step.toolName}</span>
                </div>
              )}
              
              <div className="flex gap-3 text-xs text-gray-500">
                {step.tokens && <span>Tokens: {step.tokens}</span>}
                {step.duration && <span>Duration: {step.duration}ms</span>}
                {step.cost && <span>Cost: ${step.cost.toFixed(4)}</span>}
              </div>
              
              {step.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {step.error}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
