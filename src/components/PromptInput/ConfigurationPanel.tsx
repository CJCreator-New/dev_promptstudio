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
    // Builders
    { value: "Bolt.new", label: "🏗️ Bolt.new" },
    { value: "Lovable.dev", label: "🏗️ Lovable.dev" },
    { value: "Replit", label: "🏗️ Replit" },
    { value: "Google AI Studio", label: "🏗️ Google AI Studio" },
    { value: "Base44", label: "🏗️ Base44" },
    { value: "V0", label: "🏗️ V0" },
    { value: "Glide", label: "🏗️ Glide" },
    { value: "Softr", label: "🏗️ Softr" },
    { value: "Adalo", label: "🏗️ Adalo" },
    { value: "Bravo Studio", label: "🏗️ Bravo Studio" },
    { value: "Thunkable", label: "🏗️ Thunkable" },
    { value: "Bubble", label: "🏗️ Bubble" },
    { value: "FlutterFlow", label: "🏗️ FlutterFlow" },
    { value: "Appgyver", label: "🏗️ Appgyver" },
    { value: "OutSystems", label: "🏗️ OutSystems" },
    { value: "AppMySite", label: "🏗️ AppMySite" },
    { value: "Builder.ai", label: "🏗️ Builder.ai" },
    { value: "Clappia", label: "🏗️ Clappia" },
    { value: "GoodBarber", label: "🏗️ GoodBarber" },
    { value: "GoCodeo SaaSBuilder", label: "🏗️ GoCodeo SaaSBuilder" },
    { value: "Natively", label: "🏗️ Natively" },
    // Agents
    { value: "Cursor", label: "🤖 Cursor" },
    { value: "Cline", label: "🤖 Cline" },
    { value: "Windsurf", label: "🤖 Windsurf" },
    { value: "Trae", label: "🤖 Trae" },
    { value: "GitHub Copilot", label: "🤖 GitHub Copilot" },
    { value: "Aider", label: "🤖 Aider" },
    { value: "Continue.dev", label: "🤖 Continue.dev" },
    { value: "OpenHands", label: "🤖 OpenHands" },
    { value: "Kiro", label: "🤖 Kiro" },
    { value: "Qoder", label: "🤖 Qoder" },
    { value: "Google Antigravity", label: "🤖 Google Antigravity" },
    { value: "Zencoder", label: "🤖 Zencoder" },
    { value: "Claude Code", label: "🤖 Claude Code" },
    { value: "UiPath", label: "🤖 UiPath" },
    // Designers
    { value: "Uizard", label: "🎨 Uizard" },
    { value: "Subframe", label: "🎨 Subframe" },
    { value: "Galileo AI", label: "🎨 Galileo AI" },
    { value: "Visily", label: "🎨 Visily" },
    { value: "Tempo", label: "🎨 Tempo" },
    { value: "Onlook", label: "🎨 Onlook" },
    { value: "UX Pilot", label: "🎨 UX Pilot" },
    { value: "Polymet", label: "🎨 Polymet" },
    { value: "Stitch", label: "🎨 Stitch" },
    { value: "Autodraw", label: "🎨 Autodraw" },
    { value: "Figma AI", label: "🎨 Figma AI" },
    { value: "PromptLayer", label: "🎨 PromptLayer" },
    { value: "Humanloop", label: "🎨 Humanloop" },
    { value: "AI Parabellum", label: "🎨 AI Parabellum" },
    { value: "Promptbuilder", label: "🎨 Promptbuilder" },
    { value: "Microsoft Design AI", label: "🎨 Microsoft Design AI" },
    { value: "Adobe Firefly", label: "🎨 Adobe Firefly" }
  ];

  return (
    <div className={`p-4 sm:p-6 flex flex-wrap gap-4 bg-slate-800/30 ${disabled ? 'pointer-events-none grayscale-[0.5]' : ''}`}>
      <div className="flex flex-col gap-2 min-w-[200px] flex-1">
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
          <div className="flex flex-col gap-2 min-w-[200px] flex-1 animate-in fade-in slide-in-from-top-1 duration-200">
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

          <div className="flex flex-col gap-2 min-w-[200px] flex-1 animate-in fade-in slide-in-from-top-1 duration-200 delay-75">
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

          <div className="flex flex-col gap-2 min-w-[200px] flex-1 animate-in fade-in slide-in-from-top-1 duration-200 delay-100">
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