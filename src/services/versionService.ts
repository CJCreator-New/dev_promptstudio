import { db, Version } from '../utils/db';

const MAX_VERSIONS = 50;

export const versionService = {
  async createVersion(promptId: number, content: string, message: string = 'Auto-save'): Promise<Version> {
    // Check version count and remove oldest if at limit
    const existing = await db.versions.where('promptId').equals(promptId).sortBy('timestamp');
    if (existing.length >= MAX_VERSIONS) {
      await db.versions.delete(existing[0].id!);
    }

    const id = await db.versions.add({
      promptId,
      content,
      timestamp: Date.now(),
      message,
    });

    return { id, promptId, content, timestamp: Date.now(), message };
  },

  async getVersions(promptId: number): Promise<Version[]> {
    return db.versions
      .where('promptId')
      .equals(promptId)
      .reverse()
      .sortBy('timestamp');
  },

  async getVersion(id: number): Promise<Version | undefined> {
    return db.versions.get(id);
  },

  async revertToVersion(versionId: number): Promise<Version | null> {
    const version = await db.versions.get(versionId);
    if (!version) return null;

    // Create new version from reverted content
    return this.createVersion(version.promptId, version.content, `Reverted to version ${versionId}`);
  },

  async deleteVersions(promptId: number): Promise<void> {
    await db.versions.where('promptId').equals(promptId).delete();
  },
};
