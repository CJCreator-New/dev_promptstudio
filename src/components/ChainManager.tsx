import React, { useState } from 'react';
import { useChainStore } from '../store/chainStore';
import { ChainBuilder } from './ChainBuilder';

export const ChainManager: React.FC = () => {
  const { chains, activeChainId, createChain, deleteChain, setActiveChain } = useChainStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChainName, setNewChainName] = useState('');
  const [newChainDesc, setNewChainDesc] = useState('');

  const handleCreateChain = () => {
    if (!newChainName.trim()) return;
    const id = createChain(newChainName, newChainDesc);
    setActiveChain(id);
    setShowCreateModal(false);
    setNewChainName('');
    setNewChainDesc('');
  };

  return (
    <div className="h-screen flex">
      <div className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chains</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            + New
          </button>
        </div>

        <div className="space-y-2">
          {chains.map((chain) => (
            <div
              key={chain.id}
              className={`p-3 rounded cursor-pointer ${
                activeChainId === chain.id ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-100'
              } border`}
              onClick={() => setActiveChain(chain.id)}
            >
              <div className="font-medium text-sm">{chain.name}</div>
              {chain.description && <div className="text-xs text-gray-500 mt-1">{chain.description}</div>}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>{chain.nodes.length} nodes</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this chain?')) deleteChain(chain.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {chains.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-8">
            No chains yet. Create one to start building workflows.
          </div>
        )}
      </div>

      <div className="flex-1">
        <ChainBuilder />
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Chain</h3>
            <input
              type="text"
              placeholder="Chain name"
              value={newChainName}
              onChange={(e) => setNewChainName(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-3"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newChainDesc}
              onChange={(e) => setNewChainDesc(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4 h-24"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateChain}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewChainName('');
                  setNewChainDesc('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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
