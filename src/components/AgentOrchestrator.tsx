import React, { useState } from 'react';
import { useAgentStore } from '../store/agentStore';
import { OrchestrationService } from '../services/orchestrationService';
import { useApiConfigStore } from '../store/apiConfigStore';

export const AgentOrchestrator: React.FC = () => {
  const { agents, tasks, messages, addTask, assignTask, getAgentMessages } = useAgentStore();
  const { getActiveApiKey } = useApiConfigStore();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleCreateTask = () => {
    if (!taskForm.description) return;
    addTask({ description: taskForm.description, priority: taskForm.priority, assignedTo: null });
    setTaskForm({ description: '', priority: 'medium' });
    setShowTaskModal(false);
  };

  const handleAssignTask = async (taskId: string, agentId: string) => {
    const apiKey = getActiveApiKey('google');
    if (!apiKey) {
      alert('Please configure Google API key');
      return;
    }

    const task = tasks.find((t) => t.id === taskId);
    const agent = agents.find((a) => a.id === agentId);
    if (!task || !agent) return;

    assignTask(taskId, agentId);
    
    const orchestrator = new OrchestrationService(apiKey);
    try {
      await orchestrator.executeTask(task, agent);
    } catch (error) {
      console.error('Task execution failed:', error);
    }
  };

  const agentMessages = selectedAgent ? getAgentMessages(selectedAgent) : [];

  return (
    <div className="h-screen flex">
      <div className="w-80 bg-gray-50 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Agents</h2>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`p-3 rounded cursor-pointer ${
                selectedAgent === agent.id ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-100'
              } border`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{agent.name}</span>
                <span className={`w-2 h-2 rounded-full ${
                  agent.status === 'idle' ? 'bg-green-500' :
                  agent.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="text-xs text-gray-600">{agent.role}</div>
              {agent.currentTask && (
                <div className="mt-1 text-xs text-blue-600">Working on task...</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Task Orchestration</h1>
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + New Task
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Tasks</h3>
              <div className="space-y-2">
                {tasks.map((task) => {
                  const assignedAgent = agents.find((a) => a.id === task.assignedTo);
                  return (
                    <div key={task.id} className="p-3 bg-white border rounded">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">{task.description}</div>
                          <div className="flex gap-2 text-xs">
                            <span className={`px-2 py-0.5 rounded ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-0.5 rounded ${
                              task.status === 'completed' ? 'bg-green-100 text-green-700' :
                              task.status === 'failed' ? 'bg-red-100 text-red-700' :
                              task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {assignedAgent && (
                        <div className="text-xs text-gray-600 mb-2">
                          Assigned to: {assignedAgent.name}
                        </div>
                      )}

                      {task.result && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <div className="font-medium mb-1">Result:</div>
                          <div className="text-gray-700 line-clamp-2">{task.result}</div>
                        </div>
                      )}

                      {task.status === 'pending' && (
                        <select
                          onChange={(e) => handleAssignTask(task.id, e.target.value)}
                          className="w-full mt-2 px-2 py-1 border rounded text-sm"
                          defaultValue=""
                        >
                          <option value="" disabled>Assign to agent...</option>
                          {agents.filter((a) => a.status === 'idle').map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Communication</h3>
              {selectedAgent ? (
                <div className="space-y-2">
                  {agentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded ${
                        msg.from === selectedAgent ? 'bg-blue-100 ml-4' : 'bg-gray-100 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {msg.from === selectedAgent ? 'Agent' : msg.from}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm">{msg.content}</div>
                    </div>
                  ))}
                  {agentMessages.length === 0 && (
                    <div className="text-center text-gray-400 py-8">No messages</div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">Select an agent to view messages</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create Task</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded h-24"
                  placeholder="Describe the task..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setTaskForm({ description: '', priority: 'medium' });
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
