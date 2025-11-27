import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Version {
  id: number;
  promptId: number;
  content: string;
  timestamp: number;
  message: string;
}

interface VersioningStore {
  versions: Version[];
  addVersion: (version: Omit<Version, 'id' | 'timestamp'>) => void;
  getVersions: (promptId: number) => Version[];
  revertToVersion: (versionId: number) => Version | undefined;
}

export const useVersioningStore = create<VersioningStore>()(
  persist(
    (set, get) => ({
      versions: [],
      addVersion: (version) => set((state) => {
        const promptVersions = state.versions.filter(v => v.promptId === version.promptId);
        const newVersions = promptVersions.length >= 50
          ? state.versions.filter(v => v.promptId !== version.promptId || v.id !== promptVersions[0].id)
          : state.versions;
        return {
          versions: [...newVersions, { ...version, id: Date.now(), timestamp: Date.now() }]
        };
      }),
      getVersions: (promptId) => get().versions.filter(v => v.promptId === promptId).sort((a, b) => b.timestamp - a.timestamp),
      revertToVersion: (versionId) => get().versions.find(v => v.id === versionId),
    }),
    { name: 'versioning-store' }
  )
);
