import { useState, useEffect } from 'react';
import { Tag } from '../utils/db';
import { tagService } from '../services/tagService';
import { useOrganizationStore } from '../store/organizationStore';

export const TagManager = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const { addTag, removeTag } = useOrganizationStore();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    const allTags = await tagService.getTags();
    setTags(allTags);
  };

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    
    const tag = await tagService.createTag(newTagName.trim(), newTagColor);
    addTag({ name: tag.name, color: tag.color, usageCount: 0 });
    setNewTagName('');
    await loadTags();
  };

  const handleDelete = async (id: number) => {
    await tagService.deleteTag(id);
    removeTag(id);
    await loadTags();
  };

  return (
    <div className="tag-manager">
      <div className="tag-input">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Tag name"
          aria-label="New tag name"
        />
        <input
          type="color"
          value={newTagColor}
          onChange={(e) => setNewTagColor(e.target.value)}
          aria-label="Tag color"
        />
        <button onClick={handleCreate} aria-label="Create tag">
          Add Tag
        </button>
      </div>
      <div className="tag-list">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-item" style={{ borderColor: tag.color }}>
            <span style={{ color: tag.color }}>{tag.name}</span>
            <span className="usage-count">({tag.usageCount})</span>
            <button onClick={() => handleDelete(tag.id!)} aria-label={`Delete ${tag.name}`}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
