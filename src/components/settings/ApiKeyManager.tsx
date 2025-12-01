import React from 'react';
import { Key, Shield } from 'lucide-react';
import { useApiKeyStore } from '../../store/useApiKeyStore';
import { PROVIDER_CONFIGS, KeyProvider } from '../../types/apiKeys';
import { ApiKeyInputRow } from './ApiKeyInputRow';
import { verifyApiKey } from '../../services/llm/verificationService';
import { notifySuccess, notifyError } from '../ToastSystem';

export const ApiKeyManager: React.FC = () => {
  const { keys, models, setKey, setModel, updateKeyStatus, deleteKey } = useApiKeyStore();

  const handleSave = (provider: KeyProvider, value: string, model?: string) => {
    setKey(provider, value, model);
    notifySuccess(`${PROVIDER_CONFIGS[provider].label} API key saved`);
  };

  const handleVerify = async (provider: KeyProvider, value: string) => {
    updateKeyStatus(provider, 'loading');
    
    try {
      const result = await verifyApiKey(provider, value);
      updateKeyStatus(provider, result.valid ? 'verified' : 'invalid');
      
      if (result.valid) {
        notifySuccess(`${PROVIDER_CONFIGS[provider].label} API key verified`);
      } else if (result.rateLimited) {
        notifyError(`Rate limited. Please wait before verifying again.`);
      } else {
        notifyError(result.error || `${PROVIDER_CONFIGS[provider].label} API key verification failed`);
      }
    } catch (error) {
      updateKeyStatus(provider, 'invalid');
      notifyError('Verification failed. Please check your connection.');
    }
  };

  const handleDelete = (provider: KeyProvider) => {
    if (window.confirm(`Delete ${PROVIDER_CONFIGS[provider].label} API key?`)) {
      deleteKey(provider);
      notifySuccess(`${PROVIDER_CONFIGS[provider].label} API key deleted`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <Key className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">API Key Management</h2>
            <p className="text-sm text-slate-400">Manage your LLM provider API keys</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p className="font-medium mb-1">Security Notice</p>
              <p className="text-blue-300/80">
                Your API keys are encrypted and stored locally in your browser. They never leave your device except when making requests to the respective LLM providers.
              </p>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
            <span className="text-amber-400 flex-shrink-0 mt-0.5">⚡</span>
            <div className="text-sm text-amber-200">
              <p className="font-medium mb-1">Rate Limiting</p>
              <p className="text-amber-300/80">
                Verification requests are rate-limited (2 seconds between checks) and cached for 5 minutes to prevent API quota issues.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {(Object.keys(PROVIDER_CONFIGS) as KeyProvider[]).map((provider) => (
            <ApiKeyInputRow
              key={provider}
              provider={provider}
              config={PROVIDER_CONFIGS[provider]}
              value={keys[provider]?.value || ''}
              model={models[provider]}
              status={keys[provider]?.status || 'unverified'}
              onSave={handleSave}
              onModelChange={setModel}
              onDelete={handleDelete}
              onVerify={handleVerify}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
