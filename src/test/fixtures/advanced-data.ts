import { Workspace, Version, Tag, Folder, AIProvider, Analytics, Chain, CommunityTemplate, Theme, Operation } from '../../utils/db';

export const mockCommunityTemplate = (): CommunityTemplate => ({
  id: 1,
  title: 'Test Template',
  content: 'Template content',
  author: 'Test Author',
  rating: 4.5,
  downloads: 100,
  createdAt: Date.now(),
});

export const mockWorkspaceData = (): Workspace => ({
  id: 1,
  name: 'Test Workspace',
  description: 'Test workspace description',
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const mockVersionData = (): Version => ({
  id: 1,
  promptId: 1,
  content: 'Version content',
  timestamp: Date.now(),
  message: 'Initial version',
});

export const mockTagData = (): Tag => ({
  id: 1,
  name: 'test-tag',
  color: '#3b82f6',
  usageCount: 0,
  createdAt: Date.now(),
});

export const mockFolderData = (): Folder => ({
  id: 1,
  name: 'Test Folder',
  parentId: null,
  path: '/test-folder',
  createdAt: Date.now(),
});

export const mockAIProviderData = (): AIProvider => ({
  id: 1,
  name: 'Custom Provider',
  endpoint: 'https://api.example.com',
  apiKey: 'test-key',
  model: 'gpt-4',
  enabled: true,
});

export const mockAnalyticsData = (): Analytics => ({
  id: 1,
  promptId: 1,
  usageCount: 10,
  successRate: 0.95,
  avgResponseTime: 1500,
  lastUsed: Date.now(),
});

export const mockChainData = (): Chain => ({
  id: 1,
  name: 'Test Chain',
  steps: [{ promptId: 1, order: 0 }],
  createdAt: Date.now(),
});

export const mockThemeData = (): Theme => ({
  id: 1,
  name: 'Dark Theme',
  colors: { primary: '#3b82f6', background: '#0f172a' },
  isActive: false,
});

export const mockOperationData = (): Operation => ({
  id: 1,
  type: 'create',
  entity: 'prompt',
  data: { title: 'Test' },
  timestamp: Date.now(),
  synced: false,
});
