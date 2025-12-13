import React from 'react';
import { Link2 } from 'lucide-react';

interface RelatedItem {
  id: string;
  title: string;
  type: string;
  relevance?: number;
}

interface RelatedContentProps {
  items: RelatedItem[];
  onSelect: (item: RelatedItem) => void;
  title?: string;
  maxItems?: number;
  className?: string;
}

export const RelatedContent: React.FC<RelatedContentProps> = ({ 
  items, 
  onSelect,
  title = 'Related Content',
  maxItems = 5,
  className = '' 
}) => {
  const displayItems = items.slice(0, maxItems);

  if (!displayItems.length) return null;

  return (
    <div className={`bg-elevated border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-accent-primary" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <ul className="space-y-2">
        {displayItems.map(item => (
          <li key={item.id}>
            <button
              onClick={() => onSelect(item)}
              className="w-full text-left p-2 rounded hover:bg-background transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm group-hover:text-accent-primary transition-colors">
                  {item.title}
                </span>
                <span className="text-xs text-muted shrink-0">{item.type}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const findRelatedContent = <T extends { id: string; tags?: string[]; category?: string }>(
  current: T,
  allItems: T[]
): T[] => {
  return allItems
    .filter(item => item.id !== current.id)
    .map(item => ({
      item,
      score: calculateRelevance(current, item)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
};

const calculateRelevance = <T extends { tags?: string[]; category?: string }>(
  a: T,
  b: T
): number => {
  let score = 0;
  
  if (a.category === b.category) score += 10;
  
  const commonTags = a.tags?.filter(tag => b.tags?.includes(tag)) || [];
  score += commonTags.length * 5;
  
  return score;
};
