/**
 * Filename: collaborationStore.ts (Enhanced)
 * Purpose: Team collaboration with comments, presence, and permissions
 * 
 * Key Functions:
 * - Workspace management
 * - User presence tracking
 * - Comment threads
 * - Permission management
 * - Activity feed
 * 
 * Dependencies: zustand, websocketService
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
}

export interface Presence {
  userId: string;
  cursorPosition?: number;
  selection?: { start: number; end: number };
  lastSeen: number;
}

export interface Comment {
  id: string;
  promptId: string;
  userId: string;
  content: string;
  position?: number;
  resolved: boolean;
  createdAt: number;
  replies: CommentReply[];
}

export interface CommentReply {
  id: string;
  userId: string;
  content: string;
  createdAt: number;
}

export interface Activity {
  id: string;
  userId: string;
  action: 'created' | 'updated' | 'commented' | 'merged' | 'shared';
  target: string;
  timestamp: number;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  members: string[];
  owner: string;
}

interface CollaborationStore {
  workspaces: Workspace[];
  activeWorkspace: string | null;
  currentUser: User | null;
  presence: Map<string, Presence>;
  comments: Comment[];
  activities: Activity[];
  
  // User
  setCurrentUser: (user: User) => void;
  
  // Workspace
  addWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string | null) => void;
  
  // Presence
  updatePresence: (userId: string, presence: Partial<Presence>) => void;
  removePresence: (userId: string) => void;
  getActiveUsers: () => User[];
  
  // Comments
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'replies'>) => void;
  addReply: (commentId: string, reply: Omit<CommentReply, 'id' | 'createdAt'>) => void;
  resolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  getComments: (promptId: string) => Comment[];
  
  // Activity
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  getActivities: (limit?: number) => Activity[];
}

export const useCollaborationStore = create<CollaborationStore>()(  persist(
    (set, get) => ({
      workspaces: [],
      activeWorkspace: null,
      currentUser: null,
      presence: new Map(),
      comments: [],
      activities: [],

      setCurrentUser: (user) => set({ currentUser: user }),

      addWorkspace: (workspace) => {
        const id = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          workspaces: [...state.workspaces, { 
            ...workspace, 
            id,
            createdAt: Date.now(), 
            updatedAt: Date.now() 
          }]
        }));
      },

      updateWorkspace: (id, updates) => set((state) => ({
        workspaces: state.workspaces.map(w => 
          w.id === id ? { ...w, ...updates, updatedAt: Date.now() } : w
        )
      })),

      removeWorkspace: (id) => set((state) => ({
        workspaces: state.workspaces.filter(w => w.id !== id),
        activeWorkspace: state.activeWorkspace === id ? null : state.activeWorkspace
      })),

      setActiveWorkspace: (id) => set({ activeWorkspace: id }),

      updatePresence: (userId, presence) => set((state) => {
        const newPresence = new Map(state.presence);
        newPresence.set(userId, { 
          userId, 
          ...newPresence.get(userId), 
          ...presence, 
          lastSeen: Date.now() 
        });
        return { presence: newPresence };
      }),

      removePresence: (userId) => set((state) => {
        const newPresence = new Map(state.presence);
        newPresence.delete(userId);
        return { presence: newPresence };
      }),

      getActiveUsers: () => {
        const now = Date.now();
        const activeThreshold = 5 * 60 * 1000; // 5 minutes
        const users: User[] = [];
        
        get().presence.forEach((presence) => {
          if (now - presence.lastSeen < activeThreshold) {
            // In real app, fetch user details
            users.push({
              id: presence.userId,
              name: `User ${presence.userId.substring(0, 4)}`,
              email: '',
              color: '#' + Math.floor(Math.random()*16777215).toString(16)
            });
          }
        });
        
        return users;
      },

      addComment: (comment) => {
        const id = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          comments: [...state.comments, {
            ...comment,
            id,
            createdAt: Date.now(),
            replies: []
          }]
        }));
      },

      addReply: (commentId, reply) => {
        const replyId = `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          comments: state.comments.map(c =>
            c.id === commentId
              ? {
                  ...c,
                  replies: [...c.replies, {
                    ...reply,
                    id: replyId,
                    createdAt: Date.now()
                  }]
                }
              : c
          )
        }));
      },

      resolveComment: (commentId) => set((state) => ({
        comments: state.comments.map(c =>
          c.id === commentId ? { ...c, resolved: true } : c
        )
      })),

      deleteComment: (commentId) => set((state) => ({
        comments: state.comments.filter(c => c.id !== commentId)
      })),

      getComments: (promptId) => {
        return get().comments.filter(c => c.promptId === promptId);
      },

      addActivity: (activity) => {
        const id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          activities: [{
            ...activity,
            id,
            timestamp: Date.now()
          }, ...state.activities].slice(0, 100) // Keep last 100
        }));
      },

      getActivities: (limit = 20) => {
        return get().activities.slice(0, limit);
      }
    }),
    { 
      name: 'collaboration-store',
      partialize: (state) => ({
        workspaces: state.workspaces,
        activeWorkspace: state.activeWorkspace,
        currentUser: state.currentUser,
        comments: state.comments,
        activities: state.activities
      })
    }
  )
);
