import React, { useState, useEffect } from 'react';
import { Key, Shield, RefreshCw } from 'lucide-react';
import { useApiKeyStore } from '../../store/useApiKeyStore';
import { getFreeModels, getCachedFreeModels } from '../../services/openRouterSync';
import { useApiConfigStore, ProviderId } from '../../store/apiConfigStore';
import { PROVIDER_CONFIGS, KeyProvider } from '../../types/apiKeys';
import { ApiKeyInputRow } from './ApiKeyInputRow';
import { verifyApiKey as verifyOldKey } from '../../services/llm/verificationService';
import { verifyApiKey } from '../../services/apiKeyVerification';
import { notifySuccess, notifyError } from '../ToastSystem';

export const ApiKeyManager: React.FC = () => {
  const oldStore = useApiKeyStore();
  const { upsertModelConfig, updateVerificationStatus, removeModelConfig } = useApiConfigStore();
  const [freeModelsCount, setFreeModelsCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    const cached = getCachedFreeModels();
    if (cached) {
      setFreeModelsCount(cached.models.length);
      setLastSync(cached.lastSyncedAt);
    }
  }, []);

  const handleSyncFreeModels = async () => {
    const openRouterKey = oldStore.keys.openrouter?.value;
    if (!openRouterKey) {
      notifyError('Add OpenRouter API key first');
      return;
    }

    setIsSyncing(true);
    try {
      const result = await getFreeModels(openRouterKey);
      setFreeModelsCount(result.models.length);
      setLastSync(result.lastSyncedAt);
      notifySuccess(`Synced ${result.models.length} free models`);
    } catch (error) {
      notifyError('Failed to sync free models');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async (provider: KeyProvider, value: string, model?: string) => {
    const modelId = model || oldStore.models[provider];
    
    console.log('💾 Saving key for', provider, 'model:', modelId, 'key length:', value.length);
    
    upsertModelConfig(provider as ProviderId, {
      modelId,
      label: modelId,
      apiKey: value,
      isVerified: false,
      isDefault: true
    });
    
    oldStore.setKey(provider, value, model);
    
    console.log('✅ Key saved to both stores');
    notifySuccess(`${PROVIDER_CONFIGS[provider].label} API key saved`);
    
    await handleVerify(provider, value, modelId);
  };

  const handleVerify = async (provider: KeyProvider, value: string, modelId?: string) => {
    oldStore.updateKeyStatus(provider, 'loading');
    
    try {
      const result = await verifyApiKey(provider as ProviderId, value);
      const model = modelId || oldStore.models[provider];
      
      updateVerificationStatus(provider as ProviderId, model, result.valid, result.error);
      oldStore.updateKeyStatus(provider, result.valid ? 'verified' : 'invalid');
      
      if (result.valid) {
        notifySuccess(`${PROVIDER_CONFIGS[provider].label} API key verified`);
      } else {
        notifyError(result.error || `${PROVIDER_CONFIGS[provider].label} API key verification failed`);
      }
    } catch (error) {
      oldStore.updateKeyStatus(provider, 'invalid');
      notifyError('Verification failed. Please check your connection.');
    }
  };

  const handleDelete = (provider: KeyProvider) => {
    if (window.confirm(`Delete ${PROVIDER_CONFIGS[provider].label} API key?`)) {
      const model = oldStore.models[provider];
      removeModelConfig(provider as ProviderId, model);
      oldStore.deleteKey(provider);
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

        {oldStore.keys.openrouter?.value && (
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">OpenRouter Free Models</h3>
                <p className="text-xs text-slate-400">
                  {freeModelsCount > 0 ? `${freeModelsCount} free models available` : 'Not synced yet'}
                  {lastSync && (
                    <span className="ml-2 text-slate-500">
                      • Last synced: {new Date(lastSync).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handleSyncFreeModels}
                disabled={isSyncing}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Free Models'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {(Object.keys(PROVIDER_CONFIGS) as KeyProvider[]).map((provider) => (
            <ApiKeyInputRow
              key={provider}
              provider={provider}
              config={PROVIDER_CONFIGS[provider]}
              value={oldStore.keys[provider]?.value || ''}
              model={oldStore.models[provider]}
              status={oldStore.keys[provider]?.status || 'unverified'}
              onSave={handleSave}
              onModelChange={oldStore.setModel}
              onDelete={handleDelete}
              onVerify={(p, v) => handleVerify(p, v)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
