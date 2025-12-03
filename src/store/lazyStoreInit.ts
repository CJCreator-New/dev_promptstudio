/**
 * Lazy store initialization to avoid blocking initial render
 */

import { useDataStore } from './index';
import { deferUntilIdle } from '../utils/deferredInit';

let historyInitialized = false;
let projectsInitialized = false;

export async function initializeHistoryStore() {
  if (historyInitialized) return;
  
  await deferUntilIdle(() => {
    // History data loads from localStorage via Zustand persist middleware
    // This just marks it as ready
    historyInitialized = true;
  });
}

export async function initializeProjectsStore() {
  if (projectsInitialized) return;
  
  await deferUntilIdle(() => {
    // Projects data loads from localStorage via Zustand persist middleware
    projectsInitialized = true;
  });
}

export function useHistoryLazy() {
  const history = useDataStore(state => state.history);
  
  if (!historyInitialized) {
    initializeHistoryStore();
    return [];
  }
  
  return history;
}

export function useProjectsLazy() {
  const projects = useDataStore(state => state.savedProjects);
  
  if (!projectsInitialized) {
    initializeProjectsStore();
    return [];
  }
  
  return projects;
}
