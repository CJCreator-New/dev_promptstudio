/**
 * Filename: BranchManager.tsx
 * Purpose: UI for managing branches (create, switch, delete, merge)
 * 
 * Key Components:
 * - Branch list with current indicator
 * - Create branch dialog
 * - Merge interface
 * - Branch visualization
 * 
 * Dependencies: versionControlStore, lucide-react
 */

import React, { useState } from 'react';
import { GitBranch, Plus, Trash2, GitMerge, Check } from 'lucide-react';
import { useVersionControlStore } from '../store/versionControlStore';
import { getBranchColor } from '../services/versionControl';

interface BranchManagerProps {
  onContentChange?: (content: string) => void;
}

export const BranchManager: React.FC<BranchManagerProps> = ({ onContentChange }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [showMerge, setShowMerge] = useState(false);
  const [mergeTo, setMergeTo] = useState('main');
  
  const {
    branches,
    currentBranch,
    createBranch,
    deleteBranch,
    switchBranch,
    merge
  } = useVersionControlStore();

  const handleCreateBranch = () => {
    if (!newBranchName.trim()) return;
    createBranch(newBranchName.trim());
    setNewBranchName('');
    setShowCreate(false);
  };

  const handleSwitchBranch = (name: string) => {
    const content = switchBranch(name);
    if (content && onContentChange) {
      onContentChange(content);
    }
  };

  const handleMerge = () => {
    const result = merge(currentBranch, mergeTo);
    if (result.success) {
      setShowMerge(false);
      alert(`Successfully merged ${currentBranch} into ${mergeTo}`);
    } else if (result.conflicts) {
      alert(`Merge conflicts detected! Please resolve manually.`);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Branches
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMerge(true)}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            title="Merge branch"
          >
            <GitMerge className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            title="Create branch"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {branches.map(branch => (
          <div
            key={branch.name}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              branch.name === currentBranch
                ? 'bg-indigo-900/30 border border-indigo-500'
                : 'bg-slate-700 hover:bg-slate-600 cursor-pointer'
            }`}
            onClick={() => branch.name !== currentBranch && handleSwitchBranch(branch.name)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-${getBranchColor(branch.name)}-400`} />
              <span className="text-slate-100 font-medium">{branch.name}</span>
              {branch.name === currentBranch && (
                <Check className="w-4 h-4 text-indigo-400" />
              )}
            </div>
            {branch.name !== 'main' && branch.name !== currentBranch && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBranch(branch.name);
                }}
                className="p-1 hover:bg-red-900/20 text-red-400 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Branch Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-slate-800 rounded-lg p-6 w-96" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Create New Branch</h3>
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateBranch()}
              placeholder="Branch name"
              className="w-full px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateBranch}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Merge Modal */}
      {showMerge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMerge(false)}>
          <div className="bg-slate-800 rounded-lg p-6 w-96" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Merge Branch</h3>
            <div className="mb-4">
              <p className="text-sm text-slate-400 mb-2">Merge {currentBranch} into:</p>
              <select
                value={mergeTo}
                onChange={(e) => setMergeTo(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
              >
                {branches.filter(b => b.name !== currentBranch).map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleMerge}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                Merge
              </button>
              <button
                onClick={() => setShowMerge(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
