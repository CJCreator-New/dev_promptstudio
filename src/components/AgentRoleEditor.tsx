import React, { useState } from 'react';
import { useAgentStore } from '../store/agentStore';

export const AgentRoleEditor: React.FC = () => {
  const { agents, addAgent, updateAgent, deleteAgent } = useAgentStore();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    systemPrompt: '',
    capabilities: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.role) return;

    const agentData = {
      name: formData.name,
      role: formData.role,
      systemPrompt: formData.systemPrompt,
      capabilities: formData.capabilities.split(',').map((c) => c.trim()).filter(Boolean),
    };

    if (editingId) {
      updateAgent(editingId, agentData);
    } else {
      addAgent(agentData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', systemPrompt: '', capabilities: '' });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    setFormData({
      name: agent.name,
      role: agent.role,
      systemPrompt: agent.systemPrompt,
      capabilities: agent.capabilities.join(', '),
    });
    setEditingId(agentId);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Agent Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Create Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="p-4 bg-white border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{agent.name}</h3>
                <p className="text-sm text-gray-600">{agent.role}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                agent.status === 'idle' ? 'bg-green-100 text-green-700' :
                agent.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {agent.status}
              </span>
            </div>

            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-1">Capabilities:</div>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.map((cap, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-gray-600">Tasks:</span>
                <span className="ml-1 font-semibold">{agent.performance.tasksCompleted}</span>
              </div>
              <div>
                <span className="text-gray-600">Success:</span>
                <span className="ml-1 font-semibold">{agent.performance.successRate.toFixed(0)}%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(agent.id)}
                className="flex-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this agent?')) deleteAgent(agent.id);
                }}
                className="flex-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Agent' : 'Create Agent'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., Research Assistant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., Data Analyst"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">System Prompt</label>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  className="w-full px-3 py-2 border rounded h-32"
                  placeholder="Define the agent's behavior and instructions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Capabilities (comma-separated)</label>
                <input
                  type="text"
                  value={formData.capabilities}
                  onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., research, analysis, writing"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                onClick={resetForm}
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
