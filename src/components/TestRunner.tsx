/**
 * Filename: TestRunner.tsx
 * Purpose: UI component for running test suites with progress tracking
 * 
 * Key Components:
 * - File upload for CSV/JSON
 * - Test execution controls (start/pause/stop)
 * - Progress indicator
 * - Real-time status updates
 * 
 * Dependencies: testSuiteStore, testParser, testExecutor
 */

import React, { useState, useRef } from 'react';
import { Upload, Play, Pause, Square, FileText } from 'lucide-react';
import { useTestSuiteStore } from '../store/testSuiteStore';
import { parseTestFile } from '../utils/testParser';
import { executeTest } from '../services/testExecutor';

export const TestRunner: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [suiteName, setSuiteName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isRunning,
    currentTestIndex,
    setRunning,
    setCurrentTestIndex,
    createSuite,
    getActiveSuite,
    updateTestCase
  } = useTestSuiteStore();

  const activeSuite = getActiveSuite();
  const progress = activeSuite 
    ? (currentTestIndex / activeSuite.testCases.length) * 100 
    : 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const result = await parseTestFile(file);
    
    if (result.success && result.data) {
      const name = suiteName || file.name.replace(/\.(csv|json)$/, '');
      createSuite(name, result.data);
      setSuiteName('');
    } else {
      setUploadError(result.error || 'Failed to parse file');
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRunTests = async () => {
    if (!activeSuite || isRunning) return;

    setRunning(true);
    setCurrentTestIndex(0);

    for (let i = 0; i < activeSuite.testCases.length; i++) {
      if (!useTestSuiteStore.getState().isRunning) break;

      const testCase = activeSuite.testCases[i];
      setCurrentTestIndex(i);

      updateTestCase(activeSuite.id, testCase.id, { status: 'running' });

      const result = await executeTest(testCase.prompt, testCase.expectedOutput);

      updateTestCase(activeSuite.id, testCase.id, {
        status: result.status,
        actualOutput: result.actualOutput,
        errorMessage: result.errorMessage,
        executionTime: result.executionTime,
        timestamp: result.timestamp
      });
    }

    setRunning(false);
    setCurrentTestIndex(activeSuite.testCases.length);
  };

  const handleStop = () => {
    setRunning(false);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Test Runner</h2>
        <FileText className="w-5 h-5 text-slate-400" />
      </div>

      {!activeSuite ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Test Suite Name (optional)"
            value={suiteName}
            onChange={(e) => setSuiteName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
          />
          
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Upload Test Suite'}
            </button>
            <p className="mt-2 text-sm text-slate-400">CSV or JSON format</p>
          </div>

          {uploadError && (
            <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {uploadError}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-100">{activeSuite.name}</h3>
              <p className="text-sm text-slate-400">{activeSuite.testCases.length} test cases</p>
            </div>
            <div className="flex gap-2">
              {!isRunning ? (
                <button
                  onClick={handleRunTests}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Run Tests
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              )}
            </div>
          </div>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Progress</span>
                <span>{currentTestIndex} / {activeSuite.testCases.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
