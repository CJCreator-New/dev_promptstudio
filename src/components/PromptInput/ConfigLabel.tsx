import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

interface ConfigLabelProps {
  label: string;
  icon: React.ReactNode;
  tooltipText: string;
  htmlFor?: string;
}

export const ConfigLabel: React.FC<ConfigLabelProps> = ({ label, icon, tooltipText, htmlFor }) => {
  return (
    <Tooltip.Root delayDuration={300}>
      <div className="flex items-center gap-1.5 mb-2">
        <Tooltip.Trigger asChild>
          <div className="flex items-center gap-1.5 cursor-help group">
            <label htmlFor={htmlFor} className="text-xs font-medium text-secondary uppercase tracking-wider group-hover:text-primary transition-colors whitespace-nowrap truncate max-w-[120px] md:max-w-none cursor-pointer">
              {label}
            </label>
            <Info className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-all" aria-hidden="true" />
          </div>
        </Tooltip.Trigger>
      </div>
      <Tooltip.Portal>
        <Tooltip.Content 
          className="z-50 bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 shadow-xl max-w-xs leading-relaxed animate-in fade-in zoom-in-95 duration-200"
          sideOffset={5}
          side="top"
        >
          {tooltipText}
          <Tooltip.Arrow className="fill-slate-700" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};