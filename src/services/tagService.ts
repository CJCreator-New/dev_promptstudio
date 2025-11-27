import { db, Tag } from '../utils/db';

export const tagService = {
  async createTag(name: string, color: string): Promise<Tag> {
    const id = await db.tags.add({
      name,
      color,
      usageCount: 0,
      createdAt: Date.now(),
    });
    return { id, name, color, usageCount: 0, createdAt: Date.now() };
  },

  async getTags(): Promise<Tag[]> {
    return db.tags.toArray();
  },

  async getTag(id: number): Promise<Tag | undefined> {
    return db.tags.get(id);
  },

  async updateTag(id: number, updates: Partial<Tag>): Promise<void> {
    await db.tags.update(id, updates);
  },

  async deleteTag(id: number): Promise<void> {
    await db.tags.delete(id);
    // Remove tag from all prompts
    const prompts = await db.prompts.toArray();
    for (const prompt of prompts) {
      if (prompt.tags.includes(id)) {
        await db.prompts.update(prompt.id!, {
          tags: prompt.tags.filter(t => t !== id)
        });
      }
    }
  },

  async incrementUsage(id: number): Promise<void> {
    const tag = await db.tags.get(id);
    if (tag) {
      await db.tags.update(id, { usageCount: (tag.usageCount || 0) + 1 });
    }
  },

  async getTagsByIds(ids: number[]): Promise<Tag[]> {
    return db.tags.where('id').anyOf(ids).toArray();
  },
};
