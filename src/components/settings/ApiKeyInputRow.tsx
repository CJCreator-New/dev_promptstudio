import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { KeyProvider, ProviderConfig } from '../../types/apiKeys';

interface ApiKeyInputRowProps {
  provider: KeyProvider;
  config: ProviderConfig;
  value: string;
  model?: string;
  status: 'unverified' | 'verified' | 'invalid' | 'loading';
  onSave: (provider: KeyProvider, value: string, model?: string) => void;
  onModelChange?: (provider: KeyProvider, model: string) => void;
  onDelete: (provider: KeyProvider) => void;
  onVerify: (provider: KeyProvider, value: string) => void;
}

const OPENROUTER_MODELS = [
  { value: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Free)' },
  { value: 'meta-llama/llama-3.2-3b-instruct:free', label: 'Llama 3.2 3B (Free)' },
  { value: 'microsoft/phi-3-mini-128k-instruct:free', label: 'Phi-3 Mini (Free)' },
  { value: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B (Free)' },
  { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (Paid)' },
  { value: 'openai/gpt-4o', label: 'GPT-4o (Paid)' },
];

export const ApiKeyInputRow: React.FC<ApiKeyInputRowProps> = ({
  provider,
  config,
  value,
  model,
  status,
  onSave,
  onModelChange,
  onDelete,
  onVerify,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [selectedModel, setSelectedModel] = useState(model || '');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (inputValue.trim()) {
      onSave(provider, inputValue.trim(), provider === 'openrouter' ? selectedModel : undefined);
      onVerify(provider, inputValue.trim());
    }
  };

  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel);
    if (onModelChange) {
      onModelChange(provider, newModel);
    }
  };

  const statusIcon = {
    verified: <Check className="w-4 h-4 text-green-400" />,
    invalid: <X className="w-4 h-4 text-red-400" />,
    loading: <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />,
    unverified: null,
  }[status];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-200">{config.label}</h3>
          {statusIcon}
        </div>
        <a
          href={config.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          Get API Key <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {provider === 'openrouter' && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-300 mb-2">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {OPENROUTER_MODELS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={config.placeholder}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            type="button"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <button
          onClick={handleSave}
          disabled={!inputValue.trim() || status === 'loading'}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
        
        {value && (
          <button
            onClick={() => onDelete(provider)}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-sm font-medium rounded-lg border border-red-500/30 transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {status === 'verified' && (
        <p className="text-xs text-green-400">✓ API key verified successfully</p>
      )}
      {status === 'invalid' && (
        <p className="text-xs text-red-400">✗ Invalid API key. Please check and try again.</p>
      )}
    </div>
  );
};
