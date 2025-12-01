import React from 'react';
import { ProviderId } from '../store/apiConfigStore';
import { useModels } from '../hooks/useModels';

interface Props {
  providerId: ProviderId | null;
  apiKey: string | null;
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
}

export const ModelSelector: React.FC<Props> = ({
  providerId,
  apiKey,
  selectedModel,
  onModelSelect
}) => {
  const { models, loading, error, refetch } = useModels(providerId, apiKey);

  if (!providerId || !apiKey) {
    return (
      <div className="text-sm text-gray-500">
        Select a provider and add API key to see models
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={selectedModel || ''}
          onChange={(e) => onModelSelect(e.target.value)}
          disabled={loading}
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">Select a model...</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.label}
            </option>
          ))}
        </select>
        
        {!loading && (
          <button
            onClick={refetch}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            title="Refresh models"
          >
            🔄
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          Loading models...
        </div>
      )}

      {error && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
          ⚠️ {error} (using fallback models)
        </div>
      )}

      {!loading && !error && models.length === 0 && (
        <div className="text-sm text-gray-500">
          No models available for this provider
        </div>
      )}
    </div>
  );
};
