import { db, Folder } from '../utils/db';

export const folderService = {
  async createFolder(name: string, parentId: number | null = null): Promise<Folder> {
    const parent = parentId ? await db.folders.get(parentId) : null;
    const path = parent ? `${parent.path}/${name}` : `/${name}`;
    
    const id = await db.folders.add({
      name,
      parentId,
      path,
      createdAt: Date.now(),
    });
    
    return { id, name, parentId, path, createdAt: Date.now() };
  },

  async getFolders(): Promise<Folder[]> {
    return db.folders.toArray();
  },

  async getFolder(id: number): Promise<Folder | undefined> {
    return db.folders.get(id);
  },

  async getChildFolders(parentId: number | null): Promise<Folder[]> {
    return db.folders.where('parentId').equals(parentId).toArray();
  },

  async updateFolder(id: number, updates: Partial<Folder>): Promise<void> {
    await db.folders.update(id, updates);
  },

  async moveFolder(id: number, newParentId: number | null): Promise<void> {
    const folder = await db.folders.get(id);
    if (!folder) return;

    const newParent = newParentId ? await db.folders.get(newParentId) : null;
    const newPath = newParent ? `${newParent.path}/${folder.name}` : `/${folder.name}`;

    await db.folders.update(id, { parentId: newParentId, path: newPath });
  },

  async deleteFolder(id: number): Promise<void> {
    // Delete all child folders recursively
    const children = await db.folders.where('parentId').equals(id).toArray();
    for (const child of children) {
      await this.deleteFolder(child.id!);
    }
    
    // Move prompts to root
    const prompts = await db.prompts.where('folderId').equals(id).toArray();
    for (const prompt of prompts) {
      await db.prompts.update(prompt.id!, { folderId: null });
    }
    
    await db.folders.delete(id);
  },
};
