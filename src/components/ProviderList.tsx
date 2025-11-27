import React from 'react';
import { Settings, Check, AlertCircle, Trash2, Star } from 'lucide-react';
import { useAIProviderStore, AIProvider } from '../store/aiProviderStore';
import { Button } from './atomic';

interface ProviderListProps {
  onConfigureProvider: (provider: AIProvider) => void;
}

export const ProviderList: React.FC<ProviderListProps> = ({ onConfigureProvider }) => {
  const { 
    providers, 
    activeProvider, 
    removeProvider, 
    setActiveProvider, 
    setDefaultProvider 
  } = useAIProviderStore();

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'valid':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />;
    }
  };

  const getProviderTypeLabel = (type: string) => {
    switch (type) {
      case 'openai': return 'OpenAI';
      case 'anthropic': return 'Anthropic';
      case 'google': return 'Google';
      case 'custom': return 'Custom';
      default: return type;
    }
  };

  return (
    <div className="space-y-3">
      {providers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No AI providers configured. Add one to get started.
        </div>
      ) : (
        providers.map((provider) => (
          <div
            key={provider.id}
            className={`p-4 border rounded-lg transition-colors ${
              activeProvider === provider.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveProvider(provider.id)}
                  className={`w-4 h-4 rounded-full border-2 ${
                    activeProvider === provider.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {activeProvider === provider.id && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                  )}
                </button>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{provider.name}</h3>
                    {provider.isDefault && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{getProviderTypeLabel(provider.type)}</span>
                    <span>•</span>
                    <span>{provider.model}</span>
                    <span>•</span>
                    {getStatusIcon(provider.validationStatus)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onConfigureProvider(provider)}
                  className="p-2"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDefaultProvider(provider.id)}
                  className="p-2"
                  disabled={provider.isDefault}
                >
                  <Star className={`w-4 h-4 ${provider.isDefault ? 'text-yellow-500 fill-current' : ''}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProvider(provider.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};