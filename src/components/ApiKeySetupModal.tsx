import React, { useState } from 'react';
import { Key, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useApiKeyStore } from '../store/useApiKeyStore';
import { verifyApiKey } from '../services/llm/verificationService';
import { notifySuccess, notifyError } from './ToastSystem';

interface ApiKeySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeySetupModal: React.FC<ApiKeySetupModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { setKey } = useApiKeyStore();

  if (!isOpen) return null;

  const handleSetup = async () => {
    if (!apiKey.trim()) {
      notifyError('Please enter an API key');
      return;
    }

    setIsVerifying(true);
    const result = await verifyApiKey('gemini', apiKey);
    setIsVerifying(false);

    if (result.valid) {
      setKey('gemini', apiKey);
      notifySuccess('API key verified and saved!');
      localStorage.setItem('hasApiKey', 'true');
      onClose();
    } else {
      notifyError(result.error || 'Invalid API key');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" />
            Setup API Key
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-semibold mb-1">API Key Required</p>
                <p className="text-blue-300/80">
                  This app requires your own Google Gemini API key. Get one free at{' '}
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">
                    Google AI Studio
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={handleSetup}
            disabled={isVerifying || !apiKey.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Verify & Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
