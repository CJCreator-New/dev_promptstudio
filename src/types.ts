export enum DomainType {
  FRONTEND = 'Frontend Development',
  BACKEND = 'Backend Systems',
  UI_UX = 'UI/UX Design',
  DEVOPS = 'DevOps & Infrastructure',
  MOBILE = 'Mobile App Development',
  FULLSTACK = 'Full Stack',
  AI_AGENTS = 'AI Agent Builders',
  GENERAL = 'General'
}

export enum PlatformType {
  WEB = 'Web (Browser)',
  MOBILE = 'Mobile (iOS/Android)',
  CROSS_PLATFORM = 'Cross-Platform (RN/Flutter)',
  DESKTOP = 'Desktop (Electron/Native)',
  CLI = 'CLI / Terminal',
  SERVER = 'Server / Cloud',
  ALL = 'Platform Agnostic'
}

export enum ComplexityLevel {
  CONCISE = 'Concise',
  DETAILED = 'Detailed',
  EXPERT = 'Expert / Architectural'
}

export enum GenerationMode {
  BASIC = 'Basic Refinement',
  PROMPT = 'Prompt Enhancement',
  OUTLINE = 'Structured Outline'
}

export interface EnhancementOptions {
  domain: DomainType;
  platform: PlatformType;
  targetTool: string;
  complexity: ComplexityLevel;
  mode: GenerationMode; 
  includeTechStack: boolean;
  includeBestPractices: boolean;
  includeEdgeCases: boolean;
  includeCodeSnippet: boolean;
  includeExampleUsage: boolean;
  includeTests: boolean;
  useThinking: boolean;
}

export interface HistoryItem {
  id: string;
  original: string;
  enhanced: string;
  timestamp: number;
  domain: DomainType;
  mode: GenerationMode;
}

export interface SavedProject {
  id: string;
  name: string;
  input: string;
  options: EnhancementOptions;
  timestamp: number;
}

export interface CustomTemplate {
  id: string;
  name: string;
  text: string;
  timestamp: number;
  domain: DomainType;
}

export interface SharedState {
  input: string;
  options: EnhancementOptions;
  enhancedPrompt: string;
  originalPrompt: string | null;
}

export interface Prompt {
  id: number;
  title: string;
  content: string;
  tags: number[];
  folderId: number | null;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SavedSearch {
  id: number;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: number;
}

export interface SearchFilters {
  tags?: number[];
  folders?: number[];
  dateRange?: { start: number; end: number };
  favorites?: boolean;
}