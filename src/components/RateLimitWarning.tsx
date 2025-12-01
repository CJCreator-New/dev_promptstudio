import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';
import { AnimatedContainer } from './ui/AnimatedContainer';

interface RateLimitWarningProps {
  provider: string;
  onSwitchProvider: () => void;
}

export const RateLimitWarning: React.FC<RateLimitWarningProps> = ({ 
  provider, 
  onSwitchProvider 
}) => {
  return (
    <AnimatedContainer animation="slide" className="mb-4">
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 text-yellow-300">
          <Icon icon={AlertTriangle} size="sm" />
          <span className="text-sm font-medium">
            {provider} rate limit reached
          </span>
        </div>
        <p className="text-xs text-yellow-200 mt-1">
          Wait 30 seconds or switch to another provider
        </p>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={onSwitchProvider}
          className="mt-2 !bg-yellow-600 hover:!bg-yellow-500 !border-yellow-500"
        >
          Switch Provider
        </Button>
      </div>
    </AnimatedContainer>
  );
};