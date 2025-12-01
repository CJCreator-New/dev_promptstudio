/**
 * Filename: testSuiteStore.ts
 * Purpose: Zustand store for managing prompt test suites, test cases, and results
 * 
 * Key Functions:
 * - loadTestSuite: Load test cases from parsed CSV/JSON
 * - runTests: Execute all test cases
 * - updateTestResult: Update individual test result
 * - clearResults: Reset test results
 * 
 * Dependencies: zustand, zustand/middleware
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TestCase {
  id: string;
  prompt: string;
  expectedOutput: string;
  actualOutput?: string;
  status: 'pending' | 'running' | 'pass' | 'fail' | 'error';
  errorMessage?: string;
  executionTime?: number;
  timestamp?: number;
}

export interface TestSuite {
  id: string;
  name: string;
  description?: string;
  testCases: TestCase[];
  createdAt: number;
  lastRun?: number;
}

export interface TestSuiteStats {
  total: number;
  passed: number;
  failed: number;
  errors: number;
  pending: number;
  passRate: number;
  avgExecutionTime: number;
}

interface TestSuiteStore {
  suites: TestSuite[];
  activeSuiteId: string | null;
  isRunning: boolean;
  currentTestIndex: number;
  
  // Actions
  createSuite: (name: string, testCases: Omit<TestCase, 'id' | 'status'>[]) => string;
  loadSuite: (suiteId: string) => void;
  deleteSuite: (suiteId: string) => void;
  updateTestCase: (suiteId: string, testCaseId: string, updates: Partial<TestCase>) => void;
  setRunning: (isRunning: boolean) => void;
  setCurrentTestIndex: (index: number) => void;
  clearResults: (suiteId: string) => void;
  getActiveSuite: () => TestSuite | null;
  getStats: (suiteId: string) => TestSuiteStats;
}

export const useTestSuiteStore = create<TestSuiteStore>()(
  persist(
    (set, get) => ({
      suites: [],
      activeSuiteId: null,
      isRunning: false,
      currentTestIndex: 0,

      createSuite: (name, testCases) => {
        const id = `suite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const suite: TestSuite = {
          id,
          name,
          testCases: testCases.map((tc, idx) => ({
            ...tc,
            id: `test_${idx}_${Date.now()}`,
            status: 'pending' as const
          })),
          createdAt: Date.now()
        };

        set((state) => ({
          suites: [...state.suites, suite],
          activeSuiteId: id
        }));

        return id;
      },

      loadSuite: (suiteId) => set({ activeSuiteId: suiteId }),

      deleteSuite: (suiteId) => set((state) => ({
        suites: state.suites.filter(s => s.id !== suiteId),
        activeSuiteId: state.activeSuiteId === suiteId ? null : state.activeSuiteId
      })),

      updateTestCase: (suiteId, testCaseId, updates) => set((state) => ({
        suites: state.suites.map(suite =>
          suite.id === suiteId
            ? {
                ...suite,
                testCases: suite.testCases.map(tc =>
                  tc.id === testCaseId ? { ...tc, ...updates } : tc
                ),
                lastRun: Date.now()
              }
            : suite
        )
      })),

      setRunning: (isRunning) => set({ isRunning }),

      setCurrentTestIndex: (index) => set({ currentTestIndex: index }),

      clearResults: (suiteId) => set((state) => ({
        suites: state.suites.map(suite =>
          suite.id === suiteId
            ? {
                ...suite,
                testCases: suite.testCases.map(tc => ({
                  ...tc,
                  status: 'pending' as const,
                  actualOutput: undefined,
                  errorMessage: undefined,
                  executionTime: undefined,
                  timestamp: undefined
                }))
              }
            : suite
        ),
        currentTestIndex: 0
      })),

      getActiveSuite: () => {
        const state = get();
        return state.suites.find(s => s.id === state.activeSuiteId) || null;
      },

      getStats: (suiteId) => {
        const suite = get().suites.find(s => s.id === suiteId);
        if (!suite) {
          return { total: 0, passed: 0, failed: 0, errors: 0, pending: 0, passRate: 0, avgExecutionTime: 0 };
        }

        const stats = suite.testCases.reduce(
          (acc, tc) => {
            acc.total++;
            if (tc.status === 'pass') acc.passed++;
            if (tc.status === 'fail') acc.failed++;
            if (tc.status === 'error') acc.errors++;
            if (tc.status === 'pending') acc.pending++;
            if (tc.executionTime) acc.totalTime += tc.executionTime;
            return acc;
          },
          { total: 0, passed: 0, failed: 0, errors: 0, pending: 0, totalTime: 0 }
        );

        return {
          ...stats,
          passRate: stats.total > 0 ? (stats.passed / stats.total) * 100 : 0,
          avgExecutionTime: stats.total > 0 ? stats.totalTime / stats.total : 0
        };
      }
    }),
    { name: 'test-suite-store' }
  )
);
