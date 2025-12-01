/**
 * Filename: ApiKeyManagementModal.tsx
 * Purpose: Multi-model API key management UI
 * 
 * Key Features:
 * - Add/edit/delete models per provider
 * - Fetch available models from API
 * - Verify each model individually
 * - Set default model per provider
 * 
 * Usage:
 * <ApiKeyManagementModal isOpen={true} onClose={() => {}} />
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Check, RefreshCw, Download } from 'lucide-react';
import { useApiConfigStore, ProviderId, ProviderModelConfig } from '../store/apiConfigStore';
import { fetchModels, verifyModel } from '../services/modelFetcher';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyManagementModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">API Key Management</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ProviderSection providerId="openai" providerName="OpenAI" />
          <ProviderSection providerId="gemini" providerName="Google Gemini" />
          <ProviderSection providerId="claude" providerName="Anthropic Claude" />
          <ProviderSection providerId="openrouter" providerName="OpenRouter" />
          <ProviderSection providerId="grok" providerName="Grok (X.AI)" />
        </div>
      </div>
    </div>
  );
};

const ProviderSection: React.FC<{ providerId: ProviderId; providerName: string }> = ({
  providerId,
  providerName
}) => {
  const { providers, upsertModelConfig, removeModelConfig, setActiveModel } = useApiConfigStore();
  const provider = providers[providerId];
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="bg-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">{providerName}</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Model
        </button>
      </div>

      {provider.models.length === 0 ? (
        <p className="text-sm text-slate-400">No models configured</p>
      ) : (
        <div className="space-y-3">
          {provider.models.map((model) => (
            <ModelCard
              key={model.modelId}
              providerId={providerId}
              model={model}
              isActive={provider.activeModelId === model.modelId}
              onSetActive={() => setActiveModel(providerId, model.modelId)}
              onDelete={() => removeModelConfig(providerId, model.modelId)}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddModelForm
          providerId={providerId}
          onSave={(model) => {
            upsertModelConfig(providerId, model);
            setShowAdd(false);
          }}
          onCancel={() => setShowAdd(false)}
        />
      )}
    </div>
  );
};

const ModelCard: React.FC<{
  providerId: ProviderId;
  model: ProviderModelConfig;
  isActive: boolean;
  onSetActive: () => void;
  onDelete: () => void;
}> = ({ providerId, model, isActive, onSetActive, onDelete }) => {
  const [verifying, setVerifying] = useState(false);
  const { updateVerificationStatus, decryptKey } = useApiConfigStore();

  const handleVerify = async () => {
    setVerifying(true);
    const apiKey = decryptKey(model.apiKey);
    const result = await verifyModel(providerId, model.modelId, apiKey);
    updateVerificationStatus(providerId, model.modelId, result.success, result.error);
    setVerifying(false);
  };

  return (
    <div className={`p-3 rounded border ${isActive ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-600'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-slate-100">{model.label}</span>
            {isActive && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded">Active</span>
            )}
            {model.isDefault && (
              <span className="px-2 py-0.5 bg-slate-600 text-slate-300 text-xs rounded">Default</span>
            )}
          </div>
          <div className="text-xs text-slate-400 font-mono">{model.modelId}</div>
        </div>

        <div className="flex gap-2">
          {!isActive && (
            <button
              onClick={onSetActive}
              className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-slate-300"
              title="Set as active"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-900/20 rounded text-red-400"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs">
          {model.isVerified ? (
            <span className="text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Verified {model.lastVerifiedAt && `(${new Date(model.lastVerifiedAt).toLocaleDateString()})`}
            </span>
          ) : model.verificationError ? (
            <span className="text-red-400">{model.verificationError}</span>
          ) : (
            <span className="text-slate-400">Not verified</span>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="px-2 py-1 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1"
        >
          <RefreshCw className={`w-3 h-3 ${verifying ? 'animate-spin' : ''}`} />
          Verify
        </button>
      </div>
    </div>
  );
};

const AddModelForm: React.FC<{
  providerId: ProviderId;
  onSave: (model: ProviderModelConfig) => void;
  onCancel: () => void;
}> = ({ providerId, onSave, onCancel }) => {
  const [modelId, setModelId] = useState('');
  const [label, setLabel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [availableModels, setAvailableModels] = useState<{ id: string; label: string }[]>([]);
  const { getModelCache, setModelCache } = useApiConfigStore();

  // Auto-fetch models when API key changes for OpenRouter and OpenAI
  React.useEffect(() => {
    if (apiKey && (providerId === 'openrouter' || providerId === 'openai')) {
      const timer = setTimeout(() => {
        handleFetchModels();
      }, 500); // Debounce
      return () => clearTimeout(timer);
    }
  }, [apiKey, providerId]);

  const handleFetchModels = async () => {
    if (!apiKey) return;
    
    setFetching(true);
    try {
      const cached = getModelCache(providerId);
      if (cached) {
        setAvailableModels(cached);
      } else {
        const models = await fetchModels(providerId, apiKey);
        setAvailableModels(models);
        setModelCache(providerId, models);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
    setFetching(false);
  };

  const handleSave = () => {
    if (!modelId || !apiKey) return;
    
    onSave({
      modelId,
      label: label || modelId,
      apiKey,
      isVerified: false,
      isDefault
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Add Model</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-indigo-500 focus:outline-none"
                placeholder="Enter API key"
              />
              <button
                onClick={handleFetchModels}
                disabled={!apiKey || fetching}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 text-slate-300 rounded flex items-center gap-1"
                title="Fetch available models"
              >
                <Download className={`w-4 h-4 ${fetching ? 'animate-bounce' : ''}`} />
                {fetching && <span className="text-xs">Loading...</span>}
              </button>
            </div>
            {(providerId === 'openrouter' || providerId === 'openai') && apiKey && (
              <p className="text-xs text-slate-400 mt-1">
                {fetching ? 'Fetching models...' : availableModels.length > 0 ? `${availableModels.length} models available` : 'Enter API key to fetch models'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Model ID</label>
            {availableModels.length > 0 ? (
              <select
                value={modelId}
                onChange={(e) => {
                  setModelId(e.target.value);
                  const selected = availableModels.find(m => m.id === e.target.value);
                  if (selected) setLabel(selected.label);
                }}
                className="w-full px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select a model...</option>
                {availableModels.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-indigo-500 focus:outline-none"
                placeholder="e.g., gpt-4o"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Label (optional)</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-indigo-500 focus:outline-none"
              placeholder="Display name"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded"
            />
            Set as default model
          </label>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={!modelId || !apiKey}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white rounded"
          >
            Save Model
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
