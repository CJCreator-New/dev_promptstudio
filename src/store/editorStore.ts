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
  syntaxHighlighting: boolean;
  selectedLanguage: string;
  autoCompletion: boolean;
  lineNumbers: boolean;
  wordWrap: boolean;
  fontSize: number;
  tabSize: number;
  addChain: (chain: Omit<Chain, 'id' | 'createdAt'>) => void;
  removeChain: (id: number) => void;
  setVariable: (key: string, value: string) => void;
  clearVariables: () => void;
  setSyntaxHighlighting: (enabled: boolean) => void;
  setSelectedLanguage: (language: string) => void;
  setAutoCompletion: (enabled: boolean) => void;
  setLineNumbers: (enabled: boolean) => void;
  setWordWrap: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      chains: [],
      variables: {},
      syntaxHighlighting: true,
      selectedLanguage: 'plaintext',
      autoCompletion: true,
      lineNumbers: true,
      wordWrap: true,
      fontSize: 14,
      tabSize: 2,
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
      setSyntaxHighlighting: (enabled) => set({ syntaxHighlighting: enabled }),
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      setAutoCompletion: (enabled) => set({ autoCompletion: enabled }),
      setLineNumbers: (enabled) => set({ lineNumbers: enabled }),
      setWordWrap: (enabled) => set({ wordWrap: enabled }),
      setFontSize: (size) => set({ fontSize: size }),
      setTabSize: (size) => set({ tabSize: size }),
    }),
    { name: 'editor-store' }
  )
);
