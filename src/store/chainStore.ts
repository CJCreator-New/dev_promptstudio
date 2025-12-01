import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from 'reactflow';

export interface ChainNode extends Node {
  data: {
    label: string;
    promptId?: string;
    promptContent?: string;
    condition?: string;
    loopCount?: number;
    output?: string;
  };
}

export interface Chain {
  id: string;
  name: string;
  description: string;
  nodes: ChainNode[];
  edges: Edge[];
  createdAt: number;
  updatedAt: number;
}

export interface ExecutionResult {
  nodeId: string;
  output: string;
  timestamp: number;
  tokens?: number;
  cost?: number;
}

interface ChainState {
  chains: Chain[];
  activeChainId: string | null;
  executionResults: Record<string, ExecutionResult[]>;
  isExecuting: boolean;
  
  createChain: (name: string, description?: string) => string;
  updateChain: (id: string, updates: Partial<Chain>) => void;
  deleteChain: (id: string) => void;
  setActiveChain: (id: string | null) => void;
  
  updateNodes: (chainId: string, nodes: ChainNode[]) => void;
  updateEdges: (chainId: string, edges: Edge[]) => void;
  
  setExecutionResults: (chainId: string, results: ExecutionResult[]) => void;
  clearExecutionResults: (chainId: string) => void;
  setIsExecuting: (isExecuting: boolean) => void;
}

export const useChainStore = create<ChainState>()(
  persist(
    (set, get) => ({
      chains: [],
      activeChainId: null,
      executionResults: {},
      isExecuting: false,

      createChain: (name, description = '') => {
        const id = `chain_${Date.now()}`;
        const newChain: Chain = {
          id,
          name,
          description,
          nodes: [],
          edges: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ chains: [...state.chains, newChain] }));
        return id;
      },

      updateChain: (id, updates) => {
        set((state) => ({
          chains: state.chains.map((chain) =>
            chain.id === id ? { ...chain, ...updates, updatedAt: Date.now() } : chain
          ),
        }));
      },

      deleteChain: (id) => {
        set((state) => ({
          chains: state.chains.filter((chain) => chain.id !== id),
          activeChainId: state.activeChainId === id ? null : state.activeChainId,
        }));
      },

      setActiveChain: (id) => set({ activeChainId: id }),

      updateNodes: (chainId, nodes) => {
        get().updateChain(chainId, { nodes });
      },

      updateEdges: (chainId, edges) => {
        get().updateChain(chainId, { edges });
      },

      setExecutionResults: (chainId, results) => {
        set((state) => ({
          executionResults: { ...state.executionResults, [chainId]: results },
        }));
      },

      clearExecutionResults: (chainId) => {
        set((state) => {
          const { [chainId]: _, ...rest } = state.executionResults;
          return { executionResults: rest };
        });
      },

      setIsExecuting: (isExecuting) => set({ isExecuting }),
    }),
    {
      name: 'chain-storage',
      version: 1,
    }
  )
);
