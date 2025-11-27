import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { DomainType, ComplexityLevel, EnhancementOptions, PlatformType, GenerationMode } from '../types';
import { Settings2, Zap, Code2, Layers, ShieldCheck, Sparkles, BrainCircuit, Lightbulb, ChevronDown, Save, AlertTriangle, Lock, FileCode, Terminal, LayoutTemplate, TestTube, PlusCircle, MonitorSmartphone, Bot, Info, FileText, Wand2 } from 'lucide-react';
import { notifySuccess, notifyConfigChange } from './ToastSystem';
import { ConfigPanelSkeleton, SuggestionsSkeleton } from './Loaders';
import { Spinner } from './LoadingPrimitives';
import { promptInputSchema } from '../utils/validation';
import { InlineError } from './ErrorComponents';
import { EXAMPLE_PROMPTS } from '../utils/constants';
import { SaveStatus } from './SaveStatus';

interface PromptInputProps {
  input: string;
  setInput: (value: string) => void;
  options: EnhancementOptions;
  setOptions: (options: EnhancementOptions) => void;
  onEnhance: () => void;
  onSave: () => void;
  onSaveTemplate: () => void;
  isLoading: boolean;
  isBooting?: boolean;
  readOnly?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: number | null;
}

interface ConfigLabelProps {
  label: string;
  icon: React.ReactNode;
  tooltipText: string;
  htmlFor?: string;
}

const ConfigLabel: React.FC<ConfigLabelProps> = ({ label, icon, tooltipText, htmlFor }) => {
  return (
    <Tooltip.Root delayDuration={300}>
      <div className="flex items-center gap-1.5 mb-2">
        <Tooltip.Trigger asChild>
          <div className="flex items-center gap-1.5 cursor-help group">
            <label htmlFor={htmlFor} className="text-xs font-medium text-slate-300 uppercase tracking-wider group-hover:text-indigo-400 transition-colors whitespace-nowrap truncate max-w-[120px] md:max-w-none cursor-pointer">
              {label}
            </label>
            <Info className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-all" aria-hidden="true" />
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

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  [DomainType.FRONTEND]: ["React Hooks", "Tailwind CSS", "Responsive", "Accessibility", "TypeScript", "Performance"],
  [DomainType.BACKEND]: ["REST API", "GraphQL", "PostgreSQL", "Auth", "Microservices", "Docker"],
  [DomainType.UI_UX]: ["Color Palette", "Typography", "User Flow", "Wireframe", "Figma", "Dark Mode"],
  [DomainType.DEVOPS]: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Monitoring", "Security"],
  [DomainType.MOBILE]: ["React Native", "Expo", "Offline Mode", "Notifications", "Gestures"],
  [DomainType.FULLSTACK]: ["MERN Stack", "Serverless", "Schema", "Integration", "Testing"]
};

const KEYWORD_ASSOCIATIONS: Record<string, { any: string[], [key: string]: string[] }> = {
  "react": { any: ["Hooks", "Components"], [DomainType.FRONTEND]: ["Context API", "Redux Toolkit", "Zustand", "React Router", "Next.js"] },
  "css": { any: ["Styles", "Responsive"], [DomainType.FRONTEND]: ["Tailwind", "Flexbox", "Grid", "CSS Modules"] },
  "api": { any: ["REST", "GraphQL"], [DomainType.FRONTEND]: ["Axios", "TanStack Query"], [DomainType.BACKEND]: ["Express", "NestJS", "Swagger"] },
  "auth": { any: ["Login", "Security"], [DomainType.FRONTEND]: ["Clerk", "Auth0", "JWT Decode"], [DomainType.BACKEND]: ["Passport.js", "OAuth2", "BCrypt", "Session"] },
  "db": { any: ["SQL", "NoSQL"], [DomainType.BACKEND]: ["PostgreSQL", "MongoDB", "Redis", "Prisma"], [DomainType.FULLSTACK]: ["Supabase", "Firebase"] },
  "test": { any: ["Unit Tests", "TDD"], [DomainType.FRONTEND]: ["Jest", "React Testing Library", "Cypress"], [DomainType.BACKEND]: ["Supertest", "Mocha"] },
};

const UNIVERSAL_KEYWORDS = ["Clean Code", "Documentation", "Best Practices", "Scalable", "Modular"];

const PromptInput: React.FC<PromptInputProps> = ({ 
  input, 
  setInput, 
  options, 
  setOptions, 
  onEnhance, 
  onSave,
  onSaveTemplate,
  isLoading,
  isBooting = false,
  readOnly = false,
  saveStatus = 'idle',
  lastSaved = null
}) => {
  const [showExamples, setShowExamples] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExamples(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isBooting || readOnly || !input) {
      setValidationError(null);
      return;
    }

    const result = promptInputSchema.safeParse({ input });
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
    } else {
      setValidationError(null);
    }
  }, [input, isBooting, readOnly]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.activeElement?.id === 'main-input' && !readOnly) {
        setInput('');
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [readOnly, setInput]);

  const handleLoadExample = (text: string, label: string) => {
    if (readOnly) return;
    setInput(text);
    setShowExamples(false);
    notifySuccess(`Loaded example: ${label}`);
  };

  const suggestions = useMemo(() => {
    if (isBooting) return []; 

    const lowerInput = input.toLowerCase();
    const domainKeywords = DOMAIN_KEYWORDS[options.domain] || [];
    
    const contextualMatches: string[] = [];
    Object.keys(KEYWORD_ASSOCIATIONS).forEach(trigger => {
      if (lowerInput.includes(trigger)) {
        const association = KEYWORD_ASSOCIATIONS[trigger];
        if (association[options.domain]) {
          contextualMatches.push(...association[options.domain]);
        }
        contextualMatches.push(...association.any);
      }
    });

    const allCandidates = [...contextualMatches, ...domainKeywords, ...UNIVERSAL_KEYWORDS];
    const uniqueSet = new Set<string>();
    const finalSuggestions: string[] = [];
    
    for (const item of allCandidates) {
      if (finalSuggestions.length >= 10) break;
      if (lowerInput.includes(item.toLowerCase())) continue;
      if (uniqueSet.has(item)) continue;
      uniqueSet.add(item);
      finalSuggestions.push(item);
    }

    return finalSuggestions;
  }, [input, options.domain, isBooting]);

  const addSuggestion = (suggestion: string) => {
    if (readOnly) return;
    const needsSpace = input.length > 0 && !input.endsWith(' ');
    setInput(input + (needsSpace ? ' ' : '') + suggestion);
    notifySuccess(`Added "${suggestion}"`);
  };

  const handleToolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setOptions({ ...options, targetTool: e.target.value });
      notifyConfigChange(`Optimizing for ${e.target.value}`);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newDomain = e.target.value as DomainType;
      setOptions({ ...options, domain: newDomain });
      notifyConfigChange(`Switched context to ${newDomain}`);
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newPlatform = e.target.value as PlatformType;
      setOptions({ ...options, platform: newPlatform });
      notifyConfigChange(`Targeting ${newPlatform}`);
  };

  const isAdvancedMode = options.mode !== GenerationMode.BASIC;

  return (
    <div className={`flex flex-col h-full bg-slate-900 border rounded-2xl overflow-hidden shadow-xl shadow-black/20 transition-colors ${readOnly ? 'border-slate-800/50 opacity-80' : 'border-slate-800'}`}>
      
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between z-20 gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2 whitespace-nowrap">
            {readOnly ? <Lock className="w-4 h-4 text-slate-500" aria-hidden="true" /> : <Settings2 className="w-4 h-4 text-indigo-400" aria-hidden="true" />}
            Configuration
          </h2>
          {!readOnly && !isBooting && (
             <SaveStatus status={saveStatus} lastSaved={lastSaved} />
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!readOnly && !isBooting && (
            <>
              <button 
                  onClick={onSaveTemplate}
                  disabled={!input.trim()}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 outline-none"
                  title="Save current input text as a reusable template"
              >
                  <LayoutTemplate className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Template</span>
              </button>

              <button 
                  onClick={onSave}
                  disabled={!input.trim()}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500 outline-none"
                  title="Save current configuration as a project"
              >
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Project</span>
              </button>

              <div className="relative" ref={dropdownRef} id="examples-trigger">
                <button 
                  id="examples-btn"
                  onClick={() => setShowExamples(!showExamples)}
                  className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10 hover:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500 outline-none"
                  aria-expanded={showExamples}
                >
                  <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Examples</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showExamples ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {showExamples && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1" role="menu">
                      {EXAMPLE_PROMPTS.map((ex, i) => (
                        <button 
                          key={i}
                          onClick={() => handleLoadExample(ex.text, ex.label)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-0 transition-colors group focus:bg-slate-700/50 outline-none"
                          role="menuitem"
                        >
                            <span className="block text-xs font-bold text-indigo-400 mb-0.5 group-hover:text-indigo-300">{ex.label}</span>
                            <span className="block text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{ex.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Tooltip.Provider>
        {isBooting ? (
          <ConfigPanelSkeleton />
        ) : (
        <div id="config-grid-area" className={`p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-800/30 ${readOnly ? 'pointer-events-none grayscale-[0.5]' : ''}`}>
          
          <div className="space-y-1 min-w-0 md:col-span-4 border-b border-slate-700/50 pb-4 mb-2">
            <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800 inline-flex mx-auto w-full md:w-auto overflow-x-auto">
               <button
                 onClick={() => setOptions({...options, mode: GenerationMode.BASIC})}
                 className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${options.mode === GenerationMode.BASIC ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                 title="Simple grammar and clarity improvements"
               >
                 <Wand2 className="w-4 h-4" />
                 Basic Refinement
               </button>
               <button
                 onClick={() => setOptions({...options, mode: GenerationMode.PROMPT})}
                 className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${options.mode === GenerationMode.PROMPT ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                 title="Full prompt engineering with structure and best practices"
               >
                 <Sparkles className="w-4 h-4" />
                 Prompt Enhancer
               </button>
               <button
                 onClick={() => setOptions({...options, mode: GenerationMode.OUTLINE})}
                 className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${options.mode === GenerationMode.OUTLINE ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                 title="Generate a structured document outline"
               >
                 <FileText className="w-4 h-4" />
                 Document Outline
               </button>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <ConfigLabel 
              label="Domain" 
              icon={<Code2 className="w-3 h-3" aria-hidden="true" />}
              tooltipText="Defines the technical context. Prioritizes keywords and best practices relevant to this field."
              htmlFor="domain-select"
            />
            <div className="relative w-full">
              <select
                id="domain-select"
                disabled={readOnly}
                value={options.domain}
                onChange={handleDomainChange}
                className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-3 pr-10 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-70"
              >
                {Object.values(DomainType).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <Code2 className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
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
                <div className="relative w-full">
                <select
                    id="target-tool-select"
                    disabled={readOnly}
                    value={options.targetTool}
                    onChange={handleToolChange}
                    className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-3 pr-10 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-70 truncate md:text-clip md:whitespace-nowrap md:overflow-visible"
                >
                    <option value="general">General LLM (Default)</option>
                    <optgroup label="AI Builders (No-Code/Full-Stack)">
                    <option value="Bolt.new">Bolt.new (React/Supabase)</option>
                    <option value="Lovable.dev">Lovable.dev</option>
                    <option value="Replit">Replit (Ghostwriter)</option>
                    <option value="Google AI Studio">Google AI Studio</option>
                    <option value="Base44">Base44</option>
                    <option value="V0">V0 (Vercel)</option>
                    <option value="Glide">Glide</option>
                    <option value="Softr">Softr</option>
                    <option value="Adalo">Adalo</option>
                    <option value="Bravo Studio">Bravo Studio</option>
                    <option value="Thunkable">Thunkable</option>
                    <option value="Bubble">Bubble</option>
                    <option value="FlutterFlow">FlutterFlow</option>
                    <option value="Appgyver">Appgyver / SAP Build</option>
                    <option value="OutSystems">OutSystems</option>
                    <option value="AppMySite">AppMySite</option>
                    <option value="Builder.ai">Builder.ai</option>
                    <option value="Clappia">Clappia</option>
                    <option value="GoodBarber">GoodBarber</option>
                    <option value="GoCodeo SaaSBuilder">GoCodeo</option>
                    <option value="Natively">Natively</option>
                    </optgroup>

                    <optgroup label="Agentic IDEs (Coding Agents)">
                    <option value="Cursor">Cursor (Repo-wide)</option>
                    <option value="Cline">Cline (Autonomous)</option>
                    <option value="Windsurf">Windsurf (Cascade)</option>
                    <option value="Trae">Trae</option>
                    <option value="GitHub Copilot">GitHub Copilot Agent</option>
                    <option value="Aider">Aider</option>
                    <option value="Continue.dev">Continue.dev</option>
                    <option value="OpenHands">OpenHands</option>
                    <option value="Kiro">Kiro</option>
                    <option value="Qoder">Qoder</option>
                    <option value="Google Antigravity">Google Antigravity</option>
                    <option value="Zencoder">Zencoder Agents</option>
                    <option value="Claude Code">Claude Code</option>
                    <option value="UiPath">UiPath / Enterprise Agents</option>
                    </optgroup>

                    <optgroup label="Prompt-to-Design & UI/UX">
                    <option value="Uizard">Uizard</option>
                    <option value="Subframe">Subframe</option>
                    <option value="Galileo AI">Galileo AI</option>
                    <option value="Visily">Visily</option>
                    <option value="Tempo">Tempo</option>
                    <option value="Onlook">Onlook</option>
                    <option value="UX Pilot">UX Pilot</option>
                    <option value="Polymet">Polymet</option>
                    <option value="Stitch">Stitch (Google)</option>
                    <option value="Autodraw">Autodraw</option>
                    <option value="Microsoft Design AI">Microsoft Design AI</option>
                    <option value="Adobe Firefly">Adobe Firefly</option>
                    <option value="Figma AI">Figma AI</option>
                    </optgroup>
                    
                    <optgroup label="Prompt Ops & Engineering">
                    <option value="PromptLayer">PromptLayer</option>
                    <option value="Humanloop">Humanloop</option>
                    <option value="AI Parabellum">AI Parabellum</option>
                    <option value="Promptbuilder">Promptbuilder</option>
                    </optgroup>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                    <Bot className="w-4 h-4" aria-hidden="true" />
                </div>
                </div>
            </div>

            {/* Platform Dropdown */}
            <div className="space-y-1 min-w-0 animate-in fade-in slide-in-from-top-1 duration-200 delay-75">
                <ConfigLabel 
                label="Target Platform" 
                icon={<MonitorSmartphone className="w-3 h-3" aria-hidden="true" />}
                tooltipText="Specify where the code will run. Influences stack recommendations (e.g., Native vs. Web)."
                htmlFor="platform-select"
                />
                <div className="relative w-full">
                <select
                    id="platform-select"
                    disabled={readOnly}
                    value={options.platform}
                    onChange={handlePlatformChange}
                    className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-3 pr-10 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-70"
                >
                    {Object.values(PlatformType).map((p) => (
                    <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                    <MonitorSmartphone className="w-4 h-4" aria-hidden="true" />
                </div>
                </div>
            </div>

            <div className="space-y-1 min-w-0 animate-in fade-in slide-in-from-top-1 duration-200 delay-100">
                <ConfigLabel 
                label="Complexity" 
                icon={<Layers className="w-3 h-3" aria-hidden="true" />}
                tooltipText="Controls the depth of the output. 'Expert' includes architectural reasoning and trade-offs."
                htmlFor="complexity-select"
                />
                <div className="relative w-full">
                <select
                    id="complexity-select"
                    disabled={readOnly}
                    value={options.complexity}
                    onChange={(e) => setOptions({ ...options, complexity: e.target.value as ComplexityLevel })}
                    className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-3 pr-10 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-70"
                >
                    {Object.values(ComplexityLevel).map((c) => (
                    <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                    <Layers className="w-4 h-4" aria-hidden="true" />
                </div>
                </div>
            </div>
          </>
          )}
        </div>
        )}
      </Tooltip.Provider>

      {isAdvancedMode && (
      <div className={`px-6 pb-6 flex flex-wrap gap-y-3 gap-x-6 bg-slate-800/30 border-b border-slate-800 animate-in fade-in duration-300 ${readOnly ? 'pointer-events-none grayscale-[0.5]' : ''}`}>
        <label className="flex items-center space-x-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              disabled={readOnly}
              className="peer sr-only"
              checked={options.includeTechStack}
              onChange={(e) => setOptions({...options, includeTechStack: e.target.checked})}
            />
            <div className="w-4 h-4 border border-slate-600 rounded bg-slate-800 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"></div>
            <Zap className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" aria-hidden="true" />
          </div>
          <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Stack Recs</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              disabled={readOnly}
              className="peer sr-only"
              checked={options.includeBestPractices}
              onChange={(e) => setOptions({...options, includeBestPractices: e.target.checked})}
            />
             <div className="w-4 h-4 border border-slate-600 rounded bg-slate-800 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"></div>
             <ShieldCheck className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" aria-hidden="true" />
          </div>
          <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Best Practices</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              disabled={readOnly}
              className="peer sr-only"
              checked={options.includeEdgeCases}
              onChange={(e) => setOptions({...options, includeEdgeCases: e.target.checked})}
            />
             <div className="w-4 h-4 border border-slate-600 rounded bg-slate-800 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"></div>
             <AlertTriangle className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" aria-hidden="true" />
          </div>
          <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Edge Cases</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              disabled={readOnly}
              className="peer sr-only"
              checked={!!options.includeCodeSnippet}
              onChange={(e) => setOptions({...options, includeCodeSnippet: e.target.checked})}
            />
             <div className="w-4 h-4 border border-slate-600 rounded bg-slate-800 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"></div>
             <FileCode className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" aria-hidden="true" />
          </div>
          <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Code Snippet</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              disabled={readOnly}
              className="peer sr-only"
              checked={!!options.includeExampleUsage}
              onChange={(e) => setOptions({...options, includeExampleUsage: e.target.checked})}
            />
             <div className="w-4 h-4 border border-slate-600 rounded bg-slate-800 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"></div>
             <Terminal className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" aria-hidden="true" />
          </div>
          <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Example Usage</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              disabled={readOnly}
              className="peer sr-only"
              checked={!!options.includeTests}
              onChange={(e) => setOptions({...options, includeTests: e.target.checked})}
            />
             <div className="w-4 h-4 border border-slate-600 rounded bg-slate-800 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"></div>
             <TestTube className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" aria-hidden="true" />
          </div>
          <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Include Tests</span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer group relative pl-2 border-l border-slate-700">
          <div className="relative">
            <input 
              type="checkbox" 
              disabled={readOnly}
              className="peer sr-only"
              checked={options.useThinking}
              onChange={(e) => {
                  setOptions({...options, useThinking: e.target.checked});
                  if (e.target.checked) {
                      notifyConfigChange("Thinking Mode enabled (v3.0 Pro)");
                  }
              }}
            />
             <div className="w-4 h-4 border border-slate-500 rounded bg-slate-800 peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-colors shadow-[0_0_10px_rgba(147,51,234,0.2)] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"></div>
             <BrainCircuit className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" aria-hidden="true" />
          </div>
          <span className={`text-sm font-medium transition-colors ${options.useThinking ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-300'}`}>
            Thinking Mode
          </span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">v3.0</span>
        </label>
      </div>
      )}

      <div className="flex-1 p-6 flex flex-col gap-3">
        <label htmlFor="main-input" className="text-xs font-medium text-slate-300 uppercase tracking-wider flex justify-between">
          <span>{options.mode === GenerationMode.OUTLINE ? 'Rough Topic or Idea' : 'Your Rough Idea'}</span>
          <span className="text-slate-500" aria-live="polite" aria-atomic="true">{input.length} chars</span>
        </label>
        <div className="relative flex-1">
          <textarea
            id="main-input"
            readOnly={readOnly || isBooting}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={options.mode === GenerationMode.OUTLINE ? "e.g., A comprehensive project plan for migrating a monolith to microservices..." : "e.g., I want a react login form with validation and a nice dark mode design..."}
            className={`w-full h-full bg-slate-950/50 border rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none font-mono text-sm leading-relaxed transition-all ${readOnly ? 'cursor-default text-slate-400' : ''} ${validationError ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800'}`}
          />
          <div className="absolute bottom-4 right-4">
             <InlineError message={validationError} />
          </div>
        </div>

        {!readOnly && (
            isBooting ? (
                <SuggestionsSkeleton />
            ) : (
                suggestions.length > 0 && (
                <div id="suggestions-area" className="flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-top-1" aria-label="Smart Suggestions">
                    <div className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 mr-1" aria-hidden="true">
                    <Sparkles className="w-3 h-3" />
                    SUGGESTIONS:
                    </div>
                    {suggestions.map((suggestion, idx) => (
                    <button
                        key={idx}
                        onClick={() => addSuggestion(suggestion)}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 rounded-md text-[10px] text-slate-300 hover:text-white transition-all active:scale-95 group focus:ring-2 focus:ring-indigo-500 outline-none"
                        aria-label={`Add suggestion: ${suggestion}`}
                    >
                        <span>{suggestion}</span>
                        <PlusCircle className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" aria-hidden="true" />
                    </button>
                    ))}
                </div>
                )
            )
        )}
        
        {!readOnly && (
          <button
            id="enhance-btn"
            onClick={onEnhance}
            disabled={isLoading || !input.trim() || isBooting || !!validationError}
            className={`
              mt-1 relative w-full py-4 rounded-xl font-bold text-white shadow-lg
              transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 outline-none
              ${isLoading || !input.trim() || isBooting || !!validationError
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : options.useThinking
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25'}
              active:scale-[0.99]
            `}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                <span>
                  {options.useThinking ? 'Reasoning & Generating...' 
                    : options.mode === GenerationMode.OUTLINE ? 'Generating Outline...' 
                    : options.mode === GenerationMode.BASIC ? 'Refining...'
                    : 'Enhancing Prompt...'}
                </span>
              </>
            ) : (
              <>
                {options.useThinking ? <BrainCircuit className="w-5 h-5" aria-hidden="true" /> : <Sparkles className="w-5 h-5" aria-hidden="true" />}
                <span>
                  {options.useThinking ? 'Enhance with Thinking' 
                    : options.mode === GenerationMode.OUTLINE ? 'Generate Outline' 
                    : options.mode === GenerationMode.BASIC ? 'Refine Prompt'
                    : 'Enhance Prompt'}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptInput;