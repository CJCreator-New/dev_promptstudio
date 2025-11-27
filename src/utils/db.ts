import Dexie, { Table } from 'dexie';
import { EnhancementOptions } from '../types';

export interface Draft {
  id?: number;
  input: string;
  options: EnhancementOptions;
  timestamp: number;
}

export interface Workspace {
  id?: number;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface Version {
  id?: number;
  promptId: number;
  content: string;
  timestamp: number;
  message: string;
}

export interface Tag {
  id?: number;
  name: string;
  color: string;
  usageCount: number;
  createdAt: number;
}

export interface Folder {
  id?: number;
  name: string;
  parentId: number | null;
  path: string;
  createdAt: number;
}

export interface AIProvider {
  id?: number;
  name: string;
  endpoint: string;
  apiKey: string;
  model: string;
  enabled: boolean;
}

export interface Analytics {
  id?: number;
  promptId: number;
  usageCount: number;
  successRate: number;
  avgResponseTime: number;
  lastUsed: number;
}

export interface Chain {
  id?: number;
  name: string;
  steps: Array<{ promptId: number; order: number }>;
  createdAt: number;
}

export interface CommunityTemplate {
  id?: number;
  title: string;
  content: string;
  author: string;
  rating: number;
  downloads: number;
  createdAt: number;
}

export interface Theme {
  id?: number;
  name: string;
  colors: Record<string, string>;
  isActive: boolean;
}

export interface Operation {
  id?: number;
  type: string;
  entity: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

export interface Prompt {
  id?: number;
  title: string;
  content: string;
  tags: number[];
  folderId: number | null;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SavedSearch {
  id?: number;
  name: string;
  query: string;
  filters: string;
  createdAt: number;
}

export class DevPromptDB extends Dexie {
  drafts!: Table<Draft>;
  workspaces!: Table<Workspace>;
  versions!: Table<Version>;
  tags!: Table<Tag>;
  folders!: Table<Folder>;
  aiProviders!: Table<AIProvider>;
  analytics!: Table<Analytics>;
  chains!: Table<Chain>;
  communityTemplates!: Table<CommunityTemplate>;
  themes!: Table<Theme>;
  operations!: Table<Operation>;
  prompts!: Table<Prompt>;
  savedSearches!: Table<SavedSearch>;

  constructor() {
    super('DevPromptDB');
    this.version(1).stores({
      drafts: '++id, timestamp'
    });
    this.version(2).stores({
      drafts: '++id, timestamp',
      workspaces: '++id, name, createdAt',
      versions: '++id, promptId, timestamp',
      tags: '++id, name, createdAt',
      folders: '++id, parentId, path',
      aiProviders: '++id, name, enabled',
      analytics: '++id, promptId, lastUsed',
      chains: '++id, name, createdAt',
      communityTemplates: '++id, rating, downloads',
      themes: '++id, name, isActive',
      operations: '++id, timestamp, synced',
      prompts: '++id, *tags, folderId, isFavorite, createdAt',
      savedSearches: '++id, name, createdAt'
    });
  }
}

export const db = new DevPromptDB();