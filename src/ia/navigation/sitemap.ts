export interface SiteNode {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: SiteNode[];
  meta?: {
    description?: string;
    keywords?: string[];
    category?: string;
  };
}

export const sitemap: SiteNode[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    meta: { description: 'Main workspace', category: 'primary' }
  },
  {
    id: 'prompts',
    label: 'Prompts',
    path: '/prompts',
    icon: 'FileText',
    children: [
      { id: 'new', label: 'New Prompt', path: '/prompts/new', icon: 'Plus' },
      { id: 'history', label: 'History', path: '/prompts/history', icon: 'Clock' },
      { id: 'favorites', label: 'Favorites', path: '/prompts/favorites', icon: 'Star' }
    ]
  },
  {
    id: 'templates',
    label: 'Templates',
    path: '/templates',
    icon: 'Layout',
    children: [
      { id: 'gallery', label: 'Gallery', path: '/templates/gallery', icon: 'Grid' },
      { id: 'custom', label: 'My Templates', path: '/templates/custom', icon: 'User' }
    ]
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'Folder',
    children: [
      { id: 'all', label: 'All Projects', path: '/projects/all', icon: 'List' },
      { id: 'recent', label: 'Recent', path: '/projects/recent', icon: 'Clock' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    children: [
      { id: 'api', label: 'API Keys', path: '/settings/api', icon: 'Key' },
      { id: 'preferences', label: 'Preferences', path: '/settings/preferences', icon: 'Sliders' }
    ]
  }
];

export const findNode = (id: string, nodes: SiteNode[] = sitemap): SiteNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(id, node.children);
      if (found) return found;
    }
  }
  return null;
};

export const getPath = (id: string): SiteNode[] => {
  const path: SiteNode[] = [];
  const find = (nodes: SiteNode[], target: string): boolean => {
    for (const node of nodes) {
      path.push(node);
      if (node.id === target) return true;
      if (node.children && find(node.children, target)) return true;
      path.pop();
    }
    return false;
  };
  find(sitemap, id);
  return path;
};
