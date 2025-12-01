/**
 * Filename: TestResults.tsx
 * Purpose: Display test results with diff viewer, stats, and export functionality
 * 
 * Key Components:
 * - Summary statistics dashboard
 * - Test case results table with filtering
 * - Diff viewer for expected vs actual
 * - Export to CSV/JSON
 * 
 * Dependencies: testSuiteStore, lucide-react
 */

import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Download, Filter } from 'lucide-react';
import { useTestSuiteStore, TestCase } from '../store/testSuiteStore';

export const TestResults: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pass' | 'fail' | 'error'>('all');
  const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);
  const { getActiveSuite, getStats } = useTestSuiteStore();

  const activeSuite = getActiveSuite();
  const stats = activeSuite ? getStats(activeSuite.id) : null;

  const filteredTests = useMemo(() => {
    if (!activeSuite) return [];
    if (filterStatus === 'all') return activeSuite.testCases;
    return activeSuite.testCases.filter(tc => tc.status === filterStatus);
  }, [activeSuite, filterStatus]);

  const handleExport = (format: 'csv' | 'json') => {
    if (!activeSuite) return;

    const data = activeSuite.testCases.map(tc => ({
      prompt: tc.prompt,
      expectedOutput: tc.expectedOutput,
      actualOutput: tc.actualOutput || '',
      status: tc.status,
      executionTime: tc.executionTime || 0,
      errorMessage: tc.errorMessage || ''
    }));

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      filename = `${activeSuite.name}-results.json`;
    } else {
      const headers = 'Prompt,Expected Output,Actual Output,Status,Execution Time (ms),Error\n';
      const rows = data.map(row => 
        `"${row.prompt}","${row.expectedOutput}","${row.actualOutput}","${row.status}",${row.executionTime},"${row.errorMessage}"`
      ).join('\n');
      content = headers + rows;
      mimeType = 'text/csv';
      filename = `${activeSuite.name}-results.csv`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!activeSuite) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 text-center text-slate-400">
        No test suite loaded
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total" value={stats.total} icon={<Clock />} color="slate" />
          <StatCard label="Passed" value={stats.passed} icon={<CheckCircle />} color="green" />
          <StatCard label="Failed" value={stats.failed} icon={<XCircle />} color="red" />
          <StatCard label="Errors" value={stats.errors} icon={<AlertCircle />} color="yellow" />
          <StatCard 
            label="Pass Rate" 
            value={`${stats.passRate.toFixed(1)}%`} 
            icon={<CheckCircle />} 
            color="indigo" 
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'pass', 'fail', 'error'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Prompt</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Time (ms)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredTests.map(test => (
                <tr key={test.id} className="hover:bg-slate-700/50">
                  <td className="px-4 py-3">
                    <StatusBadge status={test.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 max-w-md truncate">
                    {test.prompt}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {test.executionTime || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedTest(test)}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTest && (
        <TestDetailModal test={selectedTest} onClose={() => setSelectedTest(null)} />
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = 
  ({ label, value, icon, color }) => (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className={`flex items-center gap-2 text-${color}-400 mb-2`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-slate-100">{value}</div>
    </div>
  );

const StatusBadge: React.FC<{ status: TestCase['status'] }> = ({ status }) => {
  const config = {
    pending: { icon: Clock, color: 'slate', label: 'Pending' },
    running: { icon: Clock, color: 'blue', label: 'Running' },
    pass: { icon: CheckCircle, color: 'green', label: 'Pass' },
    fail: { icon: XCircle, color: 'red', label: 'Fail' },
    error: { icon: AlertCircle, color: 'yellow', label: 'Error' }
  }[status];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-${config.color}-900/20 text-${config.color}-400`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const TestDetailModal: React.FC<{ test: TestCase; onClose: () => void }> = ({ test, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-100">Test Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-300">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
            <div className="p-3 bg-slate-700 rounded text-sm text-slate-300">{test.prompt}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Expected Output</label>
              <div className="p-3 bg-slate-700 rounded text-sm text-slate-300 h-40 overflow-y-auto">
                {test.expectedOutput}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Actual Output</label>
              <div className="p-3 bg-slate-700 rounded text-sm text-slate-300 h-40 overflow-y-auto">
                {test.actualOutput || 'No output yet'}
              </div>
            </div>
          </div>

          {test.errorMessage && (
            <div className="p-3 bg-red-900/20 border border-red-500 rounded text-sm text-red-400">
              {test.errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
