import React from 'react';
import { Code2, Bot, MonitorSmartphone, Layers } from 'lucide-react';
import { DomainType, ComplexityLevel, PlatformType, EnhancementOptions } from '../../types';
import { ConfigLabel } from './ConfigLabel';
import { Select } from '../atomic/Select';

interface ConfigurationPanelProps {
  options: EnhancementOptions;
  onChange: (options: EnhancementOptions) => void;
  disabled?: boolean;
  isAdvancedMode?: boolean;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ 
  options, 
  onChange, 
  disabled = false,
  isAdvancedMode = false
}) => {
  const handleDomainChange = (value: string) => {
    onChange({ ...options, domain: value as DomainType });
  };

  const handleToolChange = (value: string) => {
    onChange({ ...options, targetTool: value });
  };

  const handlePlatformChange = (value: string) => {
    onChange({ ...options, platform: value as PlatformType });
  };

  const handleComplexityChange = (value: string) => {
    onChange({ ...options, complexity: value as ComplexityLevel });
  };

  const domainOptions = Object.values(DomainType).map(d => ({ value: d, label: d }));
  const platformOptions = Object.values(PlatformType).map(p => ({ value: p, label: p }));
  const complexityOptions = Object.values(ComplexityLevel).map(c => ({ value: c, label: c }));

  const toolOptions = [
    { value: "general", label: "General LLM (Default)" },
    // AI Builders
    { value: "Bolt.new", label: "Bolt.new (React/Supabase)" },
    { value: "Lovable.dev", label: "Lovable.dev" },
    { value: "Replit", label: "Replit (Ghostwriter)" },
    { value: "V0", label: "V0 (Vercel)" },
    { value: "Cursor", label: "Cursor (Repo-wide)" },
    { value: "Cline", label: "Cline (Autonomous)" },
    { value: "Windsurf", label: "Windsurf (Cascade)" }
  ];

  return (
    <div className={`p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-800/30 ${disabled ? 'pointer-events-none grayscale-[0.5]' : ''}`}>
      <div className="space-y-1 min-w-0">
        <ConfigLabel 
          label="Domain" 
          icon={<Code2 className="w-3 h-3" aria-hidden="true" />}
          tooltipText="Defines the technical context. Prioritizes keywords and best practices relevant to this field."
          htmlFor="domain-select"
        />
        <Select
          id="domain-select"
          disabled={disabled}
          value={options.domain}
          onChange={(e) => handleDomainChange(e.target.value)}
          options={domainOptions}
        />
      </div>

      {isAdvancedMode && (
        <>
          <div className="space-y-1 min-w-0 animate-in fade-in slide-in-from-top-1 duration-200">
            <ConfigLabel 
              label="Target AI Tool" 
              icon={<Bot className="w-3 h-3" aria-hidden="true" />}
              tooltipText="Select the specific AI builder, Agent, or Design tool you are targeting. The prompt structure will be optimized for that specific tool's workflow."
              htmlFor="target-tool-select"
            />
            <Select
              id="target-tool-select"
              disabled={disabled}
              value={options.targetTool}
              onChange={(e) => handleToolChange(e.target.value)}
              options={toolOptions}
            />
          </div>

          <div className="space-y-1 min-w-0 animate-in fade-in slide-in-from-top-1 duration-200 delay-75">
            <ConfigLabel 
              label="Target Platform" 
              icon={<MonitorSmartphone className="w-3 h-3" aria-hidden="true" />}
              tooltipText="Specify where the code will run. Influences stack recommendations (e.g., Native vs. Web)."
              htmlFor="platform-select"
            />
            <Select
              id="platform-select"
              disabled={disabled}
              value={options.platform}
              onChange={(e) => handlePlatformChange(e.target.value)}
              options={platformOptions}
            />
          </div>

          <div className="space-y-1 min-w-0 animate-in fade-in slide-in-from-top-1 duration-200 delay-100">
            <ConfigLabel 
              label="Complexity" 
              icon={<Layers className="w-3 h-3" aria-hidden="true" />}
              tooltipText="Controls the depth of the output. 'Expert' includes architectural reasoning and trade-offs."
              htmlFor="complexity-select"
            />
            <Select
              id="complexity-select"
              disabled={disabled}
              value={options.complexity}
              onChange={(e) => handleComplexityChange(e.target.value)}
              options={complexityOptions}
            />
          </div>
        </>
      )}
    </div>
  );
};