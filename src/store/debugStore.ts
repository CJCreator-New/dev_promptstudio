import { create } from 'zustand';

export interface DebugStep {
  id: string;
  type: 'prompt' | 'tool_call' | 'response' | 'error';
  timestamp: number;
  content: string;
  tokens?: number;
  cost?: number;
  duration?: number;
  toolName?: string;
  toolInput?: any;
  toolOutput?: any;
  error?: string;
  variables?: Record<string, any>;
}

export interface Breakpoint {
  id: string;
  stepType: DebugStep['type'];
  condition?: string;
  enabled: boolean;
}

export interface DebugSession {
  id: string;
  promptId: string;
  steps: DebugStep[];
  currentStepIndex: number;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  breakpoints: Breakpoint[];
  variables: Record<string, any>;
  startTime?: number;
  endTime?: number;
}

interface DebugState {
  sessions: DebugSession[];
  activeSessionId: string | null;
  
  createSession: (promptId: string) => string;
  addStep: (sessionId: string, step: DebugStep) => void;
  setCurrentStep: (sessionId: string, index: number) => void;
  setStatus: (sessionId: string, status: DebugSession['status']) => void;
  addBreakpoint: (sessionId: string, breakpoint: Breakpoint) => void;
  removeBreakpoint: (sessionId: string, breakpointId: string) => void;
  toggleBreakpoint: (sessionId: string, breakpointId: string) => void;
  updateVariables: (sessionId: string, variables: Record<string, any>) => void;
  clearSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string | null) => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
  sessions: [],
  activeSessionId: null,

  createSession: (promptId) => {
    const id = `debug_${Date.now()}`;
    const session: DebugSession = {
      id,
      promptId,
      steps: [],
      currentStepIndex: -1,
      status: 'idle',
      breakpoints: [],
      variables: {},
      startTime: Date.now(),
    };
    set((state) => ({ sessions: [...state.sessions, session] }));
    return id;
  },

  addStep: (sessionId, step) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, steps: [...s.steps, step], currentStepIndex: s.steps.length }
          : s
      ),
    }));
  },

  setCurrentStep: (sessionId, index) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, currentStepIndex: index } : s
      ),
    }));
  },

  setStatus: (sessionId, status) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, status, endTime: status === 'completed' || status === 'error' ? Date.now() : s.endTime }
          : s
      ),
    }));
  },

  addBreakpoint: (sessionId, breakpoint) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, breakpoints: [...s.breakpoints, breakpoint] } : s
      ),
    }));
  },

  removeBreakpoint: (sessionId, breakpointId) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, breakpoints: s.breakpoints.filter((b) => b.id !== breakpointId) }
          : s
      ),
    }));
  },

  toggleBreakpoint: (sessionId, breakpointId) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              breakpoints: s.breakpoints.map((b) =>
                b.id === breakpointId ? { ...b, enabled: !b.enabled } : b
              ),
            }
          : s
      ),
    }));
  },

  updateVariables: (sessionId, variables) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, variables: { ...s.variables, ...variables } } : s
      ),
    }));
  },

  clearSession: (sessionId) => {
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
      activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
    }));
  },

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
}));
