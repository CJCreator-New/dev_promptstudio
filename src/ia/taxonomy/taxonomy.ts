export interface Tag {
  id: string;
  label: string;
  category: string;
  color?: string;
  count?: number;
}

export interface TaxonomyCategory {
  id: string;
  label: string;
  tags: Tag[];
}

export const taxonomy: TaxonomyCategory[] = [
  {
    id: 'domain',
    label: 'Domain',
    tags: [
      { id: 'frontend', label: 'Frontend', category: 'domain', color: 'blue' },
      { id: 'backend', label: 'Backend', category: 'domain', color: 'green' },
      { id: 'mobile', label: 'Mobile', category: 'domain', color: 'purple' },
      { id: 'devops', label: 'DevOps', category: 'domain', color: 'orange' }
    ]
  },
  {
    id: 'complexity',
    label: 'Complexity',
    tags: [
      { id: 'simple', label: 'Simple', category: 'complexity', color: 'green' },
      { id: 'moderate', label: 'Moderate', category: 'complexity', color: 'yellow' },
      { id: 'complex', label: 'Complex', category: 'complexity', color: 'red' }
    ]
  },
  {
    id: 'status',
    label: 'Status',
    tags: [
      { id: 'draft', label: 'Draft', category: 'status', color: 'gray' },
      { id: 'active', label: 'Active', category: 'status', color: 'green' },
      { id: 'archived', label: 'Archived', category: 'status', color: 'slate' }
    ]
  }
];

export const getTagsByCategory = (categoryId: string): Tag[] => {
  return taxonomy.find(c => c.id === categoryId)?.tags || [];
};

export const getTag = (tagId: string): Tag | undefined => {
  for (const category of taxonomy) {
    const tag = category.tags.find(t => t.id === tagId);
    if (tag) return tag;
  }
};

export const filterByTags = <T extends { tags?: string[] }>(
  items: T[],
  selectedTags: string[]
): T[] => {
  if (!selectedTags.length) return items;
  return items.filter(item => 
    item.tags?.some(tag => selectedTags.includes(tag))
  );
};
