import React, { useState, useEffect } from 'react';
import { ChevronDown, Info, Star } from 'lucide-react';
import { useAIProviderStore } from '../store/aiProviderStore';
import { Button, Select } from './atomic';

interface ModelCapability {
  name: string;
  supported: boolean;
  description?: string;
}

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  capabilities: ModelCapability[];
  contextLength: number;
  costPer1kTokens?: number;
  isDefault?: boolean;
}

const MODEL_CAPABILITIES = {
  'gpt-4': [
    { name: 'Text Generation', supported: true, description: 'High-quality text generation' },
    { name: 'Code Generation', supported: true, description: 'Advanced code generation and debugging' },
    { name: 'Reasoning', supported: true, description: 'Complex reasoning and analysis' },
    { name: 'Vision', supported: false }
  ],
  'gpt-3.5-turbo': [
    { name: 'Text Generation', supported: true, description: 'Fast text generation' },
    { name: 'Code Generation', supported: true, description: 'Basic code generation' },
    { name: 'Reasoning', supported: true, description: 'Good reasoning capabilities' },
    { name: 'Vision', supported: false }
  ],
  'claude-3-opus': [
    { name: 'Text Generation', supported: true, description: 'Excellent text generation' },
    { name: 'Code Generation', supported: true, description: 'Strong code generation' },
    { name: 'Reasoning', supported: true, description: 'Superior reasoning' },
    { name: 'Vision', supported: true, description: 'Image analysis capabilities' }
  ],
  'gemini-pro': [
    { name: 'Text Generation', supported: true, description: 'High-quality text generation' },
    { name: 'Code Generation', supported: true, description: 'Good code generation' },
    { name: 'Reasoning', supported: true, description: 'Strong reasoning' },
    { name: 'Vision', supported: false }
  ]
};

const MODEL_INFO: Record<string, Omit<ModelInfo, 'provider'>> = {
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    capabilities: MODEL_CAPABILITIES['gpt-4'],
    contextLength: 8192,
    costPer1kTokens: 0.03
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    capabilities: MODEL_CAPABILITIES['gpt-3.5-turbo'],
    contextLength: 4096,
    costPer1kTokens: 0.002
  },
  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    capabilities: MODEL_CAPABILITIES['claude-3-opus'],
    contextLength: 200000,
    costPer1kTokens: 0.015
  },
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    capabilities: MODEL_CAPABILITIES['gemini-pro'],
    contextLength: 32768,
    costPer1kTokens: 0.001
  }
};

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange: (modelId: string) => void;
  showCapabilities?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  showCapabilities = true
}) => {
  const { providers, getActiveProvider, updateProvider } = useAIProviderStore();
  const [showDetails, setShowDetails] = useState(false);
  
  const activeProvider = getActiveProvider();
  const availableModels = getAvailableModels();
  const currentModel = selectedModel || activeProvider?.model;
  const modelInfo = currentModel ? MODEL_INFO[currentModel] : null;

  function getAvailableModels(): ModelInfo[] {
    return providers
      .filter(p => p.enabled && p.validationStatus === 'valid')
      .flatMap(provider => {
        const models = getModelsForProvider(provider.type);
        return models.map(modelId => ({
          ...MODEL_INFO[modelId],
          id: modelId,
          provider: provider.name,
          isDefault: provider.isDefault && provider.model === modelId
        }));
      })
      .filter(Boolean);
  }

  function getModelsForProvider(providerType: string): string[] {
    switch (providerType) {
      case 'openai':
        return ['gpt-4', 'gpt-3.5-turbo'];
      case 'anthropic':
        return ['claude-3-opus'];
      case 'google':
        return ['gemini-pro'];
      default:
        return [];
    }
  }

  const handleModelChange = async (modelId: string) => {
    onModelChange(modelId);
    
    // Update the active provider's model if it supports this model
    if (activeProvider) {
      const providerModels = getModelsForProvider(activeProvider.type);
      if (providerModels.includes(modelId)) {
        await updateProvider(activeProvider.id, { model: modelId });
      }
    }
  };

  const setAsDefault = async (modelId: string) => {
    const modelProvider = availableModels.find(m => m.id === modelId);
    if (modelProvider && activeProvider) {
      await updateProvider(activeProvider.id, { 
        model: modelId,
        isDefault: true 
      });
    }
  };

  if (availableModels.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          No models available. Please configure and validate an AI provider first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Model
        </label>
        <Select
          value={currentModel || ''}
          onChange={handleModelChange}
          options={availableModels.map(model => ({
            value: model.id,
            label: `${model.name} (${model.provider})`
          }))}
          placeholder="Choose a model..."
        />
      </div>

      {modelInfo && showCapabilities && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">{modelInfo.name}</h3>
            <div className="flex items-center space-x-2">
              {modelInfo.isDefault && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Info className="w-4 h-4" />
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
            <div>Context Length: {modelInfo.contextLength.toLocaleString()} tokens</div>
            {modelInfo.costPer1kTokens && (
              <div>Cost: ${modelInfo.costPer1kTokens}/1K tokens</div>
            )}
          </div>

          {showDetails && (
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Capabilities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {modelInfo.capabilities.map((capability) => (
                    <div
                      key={capability.name}
                      className={`flex items-center space-x-2 p-2 rounded ${
                        capability.supported 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        capability.supported ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm">{capability.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAsDefault(modelInfo.id)}
                  disabled={modelInfo.isDefault}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {modelInfo.isDefault ? 'Default Model' : 'Set as Default'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};