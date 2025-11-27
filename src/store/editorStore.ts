import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Chain {
  id: number;
  name: string;
  steps: Array<{ promptId: number; order: number }>;
  createdAt: number;
}

interface EditorStore {
  chains: Chain[];
  variables: Record<string, string>;
  addChain: (chain: Omit<Chain, 'id' | 'createdAt'>) => void;
  removeChain: (id: number) => void;
  setVariable: (key: string, value: string) => void;
  clearVariables: () => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      chains: [],
      variables: {},
      addChain: (chain) => set((state) => ({
        chains: [...state.chains, { ...chain, id: Date.now(), createdAt: Date.now() }]
      })),
      removeChain: (id) => set((state) => ({
        chains: state.chains.filter(c => c.id !== id)
      })),
      setVariable: (key, value) => set((state) => ({
        variables: { ...state.variables, [key]: value }
      })),
      clearVariables: () => set({ variables: {} }),
    }),
    { name: 'editor-store' }
  )
);
