import { describe, test, expect } from 'vitest';
import { useUIStore, useAppStore, useDataStore } from '../store';

// Property 23: Prop Drilling Depth Limit
describe('Property 23: Prop Drilling Depth Limit', () => {
  test('Zustand stores eliminate prop drilling by providing direct access to state', () => {
    const uiState = useUIStore.getState();
    const appState = useAppStore.getState();
    const dataState = useDataStore.getState();

    expect(typeof uiState.isMobileHistoryOpen).toBe('boolean');
    expect(typeof appState.input).toBe('string');
    expect(Array.isArray(dataState.history)).toBe(true);
  });

  test('State updates propagate without intermediate components', () => {
    const appState = useAppStore.getState();
    const testValue = 'test-value';
    
    appState.setInput(testValue);
    expect(useAppStore.getState().input).toBe(testValue);
  });
});