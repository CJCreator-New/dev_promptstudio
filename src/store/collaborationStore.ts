import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Workspace {
  id: number;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

interface CollaborationStore {
  workspaces: Workspace[];
  activeWorkspace: number | null;
  addWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkspace: (id: number, updates: Partial<Workspace>) => void;
  removeWorkspace: (id: number) => void;
  setActiveWorkspace: (id: number | null) => void;
}

export const useCollaborationStore = create<CollaborationStore>()(
  persist(
    (set) => ({
      workspaces: [],
      activeWorkspace: null,
      addWorkspace: (workspace) => set((state) => ({
        workspaces: [...state.workspaces, { 
          ...workspace, 
          id: Date.now(), 
          createdAt: Date.now(), 
          updatedAt: Date.now() 
        }]
      })),
      updateWorkspace: (id, updates) => set((state) => ({
        workspaces: state.workspaces.map(w => 
          w.id === id ? { ...w, ...updates, updatedAt: Date.now() } : w
        )
      })),
      removeWorkspace: (id) => set((state) => ({
        workspaces: state.workspaces.filter(w => w.id !== id)
      })),
      setActiveWorkspace: (id) => set({ activeWorkspace: id }),
    }),
    { name: 'collaboration-store' }
  )
);
