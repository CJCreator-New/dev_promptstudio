import React, { useState } from 'react';
import { Key, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { AnimatedContainer } from './ui/AnimatedContainer';

interface ApiKeyPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: string, apiKey: string) => void;
}

const providers = [
  { id: 'gemini', name: 'Google Gemini', url: 'https://aistudio.google.com/app/apikey', placeholder: 'AIza...' },
  { id: 'openai', name: 'OpenAI', url: 'https://platform.openai.com/api-keys', placeholder: 'sk-...' },
  { id: 'openrouter', name: 'OpenRouter', url: 'https://openrouter.ai/keys', placeholder: 'sk-or-...' }
];

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    
    setLoading(true);
    try {
      await onSave(selectedProvider, apiKey.trim());
      onClose();
    } catch (error) {
      console.error('Failed to save API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProviderData = providers.find(p => p.id === selectedProvider)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <AnimatedContainer animation="scale" className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Key className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Add API Key</h2>
              <p className="text-sm text-slate-400">Continue with unlimited enhancements</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id}>{provider.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={selectedProviderData.placeholder}
            />

            <a
              href={selectedProviderData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
            >
              Get {selectedProviderData.name} API Key
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Later
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave} 
              loading={loading}
              disabled={!apiKey.trim()}
              className="flex-1"
            >
              Save & Continue
            </Button>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};