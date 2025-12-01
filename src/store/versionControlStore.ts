/**
 * Filename: versionControlStore.ts
 * Purpose: Git-like version control for prompts with branches and merging
 * 
 * Key Functions:
 * - createBranch: Create new branch from current state
 * - switchBranch: Change active branch
 * - commit: Save changes with message
 * - merge: Merge branches with conflict detection
 * - rollback: Revert to previous commit
 * 
 * Dependencies: zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Commit {
  id: string;
  branchName: string;
  content: string;
  message: string;
  author: string;
  timestamp: number;
  parentId: string | null;
}

export interface Branch {
  name: string;
  headCommitId: string;
  createdAt: number;
  isProtected: boolean;
}

export interface MergeConflict {
  section: 'start' | 'middle' | 'end';
  current: string;
  incoming: string;
}

interface VersionControlStore {
  commits: Commit[];
  branches: Branch[];
  currentBranch: string;
  
  // Branch operations
  createBranch: (name: string, fromBranch?: string) => void;
  deleteBranch: (name: string) => void;
  switchBranch: (name: string) => string | null;
  getBranches: () => Branch[];
  
  // Commit operations
  commit: (content: string, message: string, author?: string) => string;
  getCommits: (branchName?: string) => Commit[];
  getCommit: (commitId: string) => Commit | null;
  
  // History operations
  rollback: (commitId: string) => string | null;
  getHistory: (branchName: string) => Commit[];
  
  // Merge operations
  merge: (sourceBranch: string, targetBranch: string) => { success: boolean; conflicts?: MergeConflict[] };
  detectConflicts: (source: string, target: string) => MergeConflict[];
}

export const useVersionControlStore = create<VersionControlStore>()(
  persist(
    (set, get) => ({
      commits: [],
      branches: [{ name: 'main', headCommitId: '', createdAt: Date.now(), isProtected: false }],
      currentBranch: 'main',

      createBranch: (name, fromBranch) => {
        const source = fromBranch || get().currentBranch;
        const sourceBranch = get().branches.find(b => b.name === source);
        
        if (!sourceBranch) return;
        if (get().branches.some(b => b.name === name)) return;

        set((state) => ({
          branches: [
            ...state.branches,
            {
              name,
              headCommitId: sourceBranch.headCommitId,
              createdAt: Date.now(),
              isProtected: false
            }
          ]
        }));
      },

      deleteBranch: (name) => {
        if (name === 'main' || name === get().currentBranch) return;
        
        set((state) => ({
          branches: state.branches.filter(b => b.name !== name)
        }));
      },

      switchBranch: (name) => {
        const branch = get().branches.find(b => b.name === name);
        if (!branch) return null;

        set({ currentBranch: name });
        
        const headCommit = get().commits.find(c => c.id === branch.headCommitId);
        return headCommit?.content || null;
      },

      getBranches: () => get().branches,

      commit: (content, message, author = 'User') => {
        const currentBranch = get().currentBranch;
        const branch = get().branches.find(b => b.name === currentBranch);
        
        const commitId = `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newCommit: Commit = {
          id: commitId,
          branchName: currentBranch,
          content,
          message,
          author,
          timestamp: Date.now(),
          parentId: branch?.headCommitId || null
        };

        set((state) => ({
          commits: [...state.commits, newCommit],
          branches: state.branches.map(b =>
            b.name === currentBranch ? { ...b, headCommitId: commitId } : b
          )
        }));

        return commitId;
      },

      getCommits: (branchName) => {
        const branch = branchName || get().currentBranch;
        return get().commits.filter(c => c.branchName === branch);
      },

      getCommit: (commitId) => {
        return get().commits.find(c => c.id === commitId) || null;
      },

      rollback: (commitId) => {
        const commit = get().getCommit(commitId);
        if (!commit) return null;

        set((state) => ({
          branches: state.branches.map(b =>
            b.name === commit.branchName ? { ...b, headCommitId: commitId } : b
          )
        }));

        return commit.content;
      },

      getHistory: (branchName) => {
        const commits = get().commits.filter(c => c.branchName === branchName);
        return commits.sort((a, b) => b.timestamp - a.timestamp);
      },

      merge: (sourceBranch, targetBranch) => {
        const source = get().branches.find(b => b.name === sourceBranch);
        const target = get().branches.find(b => b.name === targetBranch);
        
        if (!source || !target) return { success: false };

        const sourceCommit = get().commits.find(c => c.id === source.headCommitId);
        const targetCommit = get().commits.find(c => c.id === target.headCommitId);
        
        if (!sourceCommit || !targetCommit) return { success: false };

        const conflicts = get().detectConflicts(sourceCommit.content, targetCommit.content);
        
        if (conflicts.length > 0) {
          return { success: false, conflicts };
        }

        // Auto-merge: use source content
        get().commit(
          sourceCommit.content,
          `Merge ${sourceBranch} into ${targetBranch}`,
          'System'
        );

        return { success: true };
      },

      detectConflicts: (source, target) => {
        if (source === target) return [];
        
        const conflicts: MergeConflict[] = [];
        const sourceLines = source.split('\n');
        const targetLines = target.split('\n');
        
        // Simple conflict detection: if content differs significantly
        if (Math.abs(sourceLines.length - targetLines.length) > 5) {
          conflicts.push({
            section: 'middle',
            current: target,
            incoming: source
          });
        }

        return conflicts;
      }
    }),
    { name: 'version-control-store' }
  )
);
