import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Agent {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  capabilities: string[];
  status: 'idle' | 'busy' | 'error';
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: number;
    totalCost: number;
  };
}

export interface Task {
  id: string;
  description: string;
  assignedTo: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  result?: string;
  startTime?: number;
  endTime?: number;
  dependencies?: string[];
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  type: 'request' | 'response' | 'notification';
}

interface AgentState {
  agents: Agent[];
  tasks: Task[];
  messages: Message[];
  
  addAgent: (agent: Omit<Agent, 'id' | 'status' | 'performance'>) => string;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  
  addTask: (task: Omit<Task, 'id' | 'status'>) => string;
  assignTask: (taskId: string, agentId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status'], result?: string) => void;
  
  sendMessage: (from: string, to: string, content: string, type: Message['type']) => void;
  getAgentMessages: (agentId: string) => Message[];
  
  updatePerformance: (agentId: string, metrics: Partial<Agent['performance']>) => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: [],
      tasks: [],
      messages: [],

      addAgent: (agent) => {
        const id = `agent_${Date.now()}`;
        const newAgent: Agent = {
          ...agent,
          id,
          status: 'idle',
          performance: {
            tasksCompleted: 0,
            successRate: 100,
            avgResponseTime: 0,
            totalCost: 0,
          },
        };
        set((state) => ({ agents: [...state.agents, newAgent] }));
        return id;
      },

      updateAgent: (id, updates) => {
        set((state) => ({
          agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }));
      },

      deleteAgent: (id) => {
        set((state) => ({
          agents: state.agents.filter((a) => a.id !== id),
          tasks: state.tasks.map((t) => (t.assignedTo === id ? { ...t, assignedTo: null } : t)),
        }));
      },

      addTask: (task) => {
        const id = `task_${Date.now()}`;
        const newTask: Task = { ...task, id, status: 'pending' };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        return id;
      },

      assignTask: (taskId, agentId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, assignedTo: agentId, status: 'in_progress', startTime: Date.now() } : t
          ),
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, status: 'busy', currentTask: taskId } : a
          ),
        }));
      },

      updateTaskStatus: (taskId, status, result) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status, result, endTime: Date.now() } : t
          ),
          agents: state.agents.map((a) =>
            a.id === task.assignedTo ? { ...a, status: 'idle', currentTask: undefined } : a
          ),
        }));

        if (task.assignedTo && (status === 'completed' || status === 'failed')) {
          const agent = get().agents.find((a) => a.id === task.assignedTo);
          if (agent) {
            const completed = agent.performance.tasksCompleted + 1;
            const successRate = status === 'completed'
              ? ((agent.performance.successRate * agent.performance.tasksCompleted + 100) / completed)
              : ((agent.performance.successRate * agent.performance.tasksCompleted) / completed);
            
            get().updatePerformance(task.assignedTo, {
              tasksCompleted: completed,
              successRate,
            });
          }
        }
      },

      sendMessage: (from, to, content, type) => {
        const message: Message = {
          id: `msg_${Date.now()}`,
          from,
          to,
          content,
          timestamp: Date.now(),
          type,
        };
        set((state) => ({ messages: [...state.messages, message] }));
      },

      getAgentMessages: (agentId) => {
        return get().messages.filter((m) => m.from === agentId || m.to === agentId);
      },

      updatePerformance: (agentId, metrics) => {
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, performance: { ...a.performance, ...metrics } } : a
          ),
        }));
      },
    }),
    {
      name: 'agent-storage',
      version: 1,
    }
  )
);
