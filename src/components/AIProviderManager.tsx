import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AIProvider } from '../store/aiProviderStore';
import { ProviderList } from './ProviderList';
import { ProviderConfig } from './ProviderConfig';
import { Button } from './atomic';

export const AIProviderManager: React.FC = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | undefined>();

  const handleAddProvider = () => {
    setEditingProvider(undefined);
    setIsConfigOpen(true);
  };

  const handleConfigureProvider = (provider: AIProvider) => {
    setEditingProvider(provider);
    setIsConfigOpen(true);
  };

  const handleCloseConfig = () => {
    setIsConfigOpen(false);
    setEditingProvider(undefined);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Providers</h1>
          <p className="text-gray-600 mt-1">
            Manage your AI provider configurations and API keys
          </p>
        </div>
        <Button onClick={handleAddProvider}>
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </Button>
      </div>

      <ProviderList onConfigureProvider={handleConfigureProvider} />

      <ProviderConfig
        provider={editingProvider}
        isOpen={isConfigOpen}
        onClose={handleCloseConfig}
      />
    </div>
  );
};