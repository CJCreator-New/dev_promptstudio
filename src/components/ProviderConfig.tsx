import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, TestTube, Save, X } from 'lucide-react';
import { useAIProviderStore, AIProvider } from '../store/aiProviderStore';
import { Button, Input, Select, Modal } from './atomic';

interface ProviderConfigProps {
  provider?: AIProvider;
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDER_TYPES = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google', label: 'Google' },
  { value: 'custom', label: 'Custom' }
];

const DEFAULT_MODELS = {
  openai: ['gpt-4', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-opus', 'claude-3-sonnet'],
  google: ['gemini-pro', 'gemini-pro-vision'],
  custom: []
};

export const ProviderConfig: React.FC<ProviderConfigProps> = ({
  provider,
  isOpen,
  onClose
}) => {
  const { addProvider, updateProvider, validateApiKey, decryptApiKey } = useAIProviderStore();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'openai' as const,
    endpoint: '',
    apiKey: '',
    model: '',
    enabled: true,
    isDefault: false
  });
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name,
        type: provider.type,
        endpoint: provider.endpoint || '',
        apiKey: decryptApiKey(provider.apiKey),
        model: provider.model,
        enabled: provider.enabled,
        isDefault: provider.isDefault
      });
    } else {
      setFormData({
        name: '',
        type: 'openai',
        endpoint: '',
        apiKey: '',
        model: 'gpt-4',
        enabled: true,
        isDefault: false
      });
    }
    setValidationResult(null);
  }, [provider, decryptApiKey]);

  const handleTypeChange = (type: string) => {
    const typedType = type as keyof typeof DEFAULT_MODELS;
    setFormData(prev => ({
      ...prev,
      type: typedType,
      model: DEFAULT_MODELS[typedType][0] || '',
      endpoint: typedType === 'custom' ? prev.endpoint : ''
    }));
  };

  const handleValidateApiKey = async () => {
    if (!formData.apiKey) return;
    
    setIsValidating(true);
    try {
      // Create temporary provider for validation
      const tempProvider: AIProvider = {
        id: 'temp',
        name: formData.name,
        type: formData.type,
        endpoint: formData.endpoint,
        apiKey: formData.apiKey,
        model: formData.model,
        enabled: formData.enabled,
        isDefault: formData.isDefault,
        createdAt: Date.now()
      };
      
      // Use the validation logic from the store
      const isValid = await validateApiKey(tempProvider.id);
      setValidationResult(isValid);
    } catch (error) {
      setValidationResult(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (provider) {
        await updateProvider(provider.id, formData);
      } else {
        await addProvider(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save provider:', error);
    }
  };

  const isFormValid = formData.name && formData.apiKey && formData.model &&
    (formData.type !== 'custom' || formData.endpoint);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={provider ? 'Edit Provider' : 'Add Provider'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Provider Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="My AI Provider"
          required
        />

        <Select
          label="Provider Type"
          value={formData.type}
          onChange={handleTypeChange}
          options={PROVIDER_TYPES}
          required
        />

        {formData.type === 'custom' && (
          <Input
            label="API Endpoint"
            value={formData.endpoint}
            onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
            placeholder="https://api.example.com/v1"
            required
          />
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <div className="relative">
            <Input
              type={showApiKey ? 'text' : 'password'}
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Enter your API key"
              required
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-1"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleValidateApiKey}
                disabled={!formData.apiKey || isValidating}
                className="p-1"
              >
                <TestTube className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          {validationResult !== null && (
            <p className={`text-sm ${validationResult ? 'text-green-600' : 'text-red-600'}`}>
              {validationResult ? 'API key is valid' : 'API key validation failed'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Model
          </label>
          {DEFAULT_MODELS[formData.type].length > 0 ? (
            <Select
              value={formData.model}
              onChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
              options={DEFAULT_MODELS[formData.type].map(model => ({ value: model, label: model }))}
              required
            />
          ) : (
            <Input
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="Enter model name"
              required
            />
          )}
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Enabled</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Set as default</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            <Save className="w-4 h-4 mr-2" />
            {provider ? 'Update' : 'Add'} Provider
          </Button>
        </div>
      </form>
    </Modal>
  );
};