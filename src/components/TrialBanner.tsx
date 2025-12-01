import React from 'react';
import { Zap, Key } from 'lucide-react';
import { Button } from './ui/Button';
import { getTrialRemaining } from '../services/trialService';

interface TrialBannerProps {
  onAddApiKey: () => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ onAddApiKey }) => {
  const remaining = getTrialRemaining();
  
  if (remaining === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Key className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Trial Complete!</h3>
              <p className="text-sm text-slate-300">Add your API key to continue enhancing prompts</p>
            </div>
          </div>
          <Button variant="primary" icon={Key} onClick={onAddApiKey}>
            Add API Key
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 text-green-300">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">
          Free Trial: {remaining} enhancement{remaining !== 1 ? 's' : ''} remaining
        </span>
      </div>
    </div>
  );
};