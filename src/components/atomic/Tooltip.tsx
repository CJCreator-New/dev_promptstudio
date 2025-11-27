import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  side = 'top',
  delayDuration = 300 
}) => {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={5}
            className="z-50 bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 shadow-xl max-w-xs leading-relaxed animate-fade-in"
          >
            {content}
            <RadixTooltip.Arrow className="fill-slate-700" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};