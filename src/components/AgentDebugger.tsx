import React, { useState } from 'react';
import { useDebugStore } from '../store/debugStore';
import { DebugTimeline } from './DebugTimeline';
import { DebugService } from '../services/debugService';
import { useApiConfigStore } from '../store/apiConfigStore';

export const AgentDebugger: React.FC = () => {
  const { sessions, activeSessionId, createSession, setActiveSession, setCurrentStep, addBreakpoint, removeBreakpoint, toggleBreakpoint, clearSession } = useDebugStore();
  const { getActiveApiKey } = useApiConfigStore();
  const [prompt, setPrompt] = useState('');
  const [newBreakpointType, setNewBreakpointType] = useState<'prompt' | 'tool_call' | 'response' | 'error'>('prompt');

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const currentStep = activeSession?.steps[activeSession.currentStepIndex];

  const startDebug = async () => {
    const apiKey = getActiveApiKey('google');
    if (!apiKey) {
      alert('Please configure Google API key');
      return;
    }

    const sessionId = createSession('debug_prompt');
    setActiveSession(sessionId);
    
    const debugService = new DebugService(sessionId);
    await debugService.executeWithDebug(prompt, apiKey);
  };

  const handleAddBreakpoint = () => {
    if (!activeSessionId) return;
    addBreakpoint(activeSessionId, {
      id: `bp_${Date.now()}`,
      stepType: newBreakpointType,
      enabled: true,
    });
  };

  const stepForward = () => {
    if (!activeSession) return;
    const nextIndex = Math.min(activeSession.currentStepIndex + 1, activeSession.steps.length - 1);
    setCurrentStep(activeSession.id, nextIndex);
  };

  const stepBackward = () => {
    if (!activeSession) return;
    const prevIndex = Math.max(activeSession.currentStepIndex - 1, 0);
    setCurrentStep(activeSession.id, prevIndex);
  };

  return (
    <div className="h-screen flex">
      <div className="w-80 bg-gray-50 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Debug Sessions</h2>
        
        <div className="space-y-2 mb-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSession(session.id)}
              className={`p-3 rounded cursor-pointer ${
                activeSessionId === session.id ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-100'
              } border`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{session.id.slice(0, 12)}...</span>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  session.status === 'completed' ? 'bg-green-100 text-green-700' :
                  session.status === 'error' ? 'bg-red-100 text-red-700' :
                  session.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {session.status}
                </span>
              </div>
              <div className="text-xs text-gray-500">{session.steps.length} steps</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSession(session.id);
                }}
                className="mt-2 text-xs text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Breakpoints</h3>
          <div className="flex gap-2 mb-2">
            <select
              value={newBreakpointType}
              onChange={(e) => setNewBreakpointType(e.target.value as any)}
              className="flex-1 px-2 py-1 border rounded text-sm"
            >
              <option value="prompt">Prompt</option>
              <option value="tool_call">Tool Call</option>
              <option value="response">Response</option>
              <option value="error">Error</option>
            </select>
            <button
              onClick={handleAddBreakpoint}
              disabled={!activeSessionId}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              Add
            </button>
          </div>
          
          {activeSession?.breakpoints.map((bp) => (
            <div key={bp.id} className="flex items-center justify-between p-2 bg-white border rounded mb-1">
              <span className="text-sm">{bp.stepType}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleBreakpoint(activeSession.id, bp.id)}
                  className={`px-2 py-0.5 text-xs rounded ${
                    bp.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {bp.enabled ? 'On' : 'Off'}
                </button>
                <button
                  onClick={() => removeBreakpoint(activeSession.id, bp.id)}
                  className="text-xs text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white border-b">
          <div className="flex gap-2 mb-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter prompt to debug..."
              className="flex-1 px-3 py-2 border rounded h-20"
            />
            <button
              onClick={startDebug}
              disabled={!prompt.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              ▶ Debug
            </button>
          </div>

          {activeSession && (
            <div className="flex gap-2">
              <button onClick={stepBackward} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
                ← Step Back
              </button>
              <button onClick={stepForward} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
                Step Forward →
              </button>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                Step {activeSession.currentStepIndex + 1} / {activeSession.steps.length}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Timeline</h3>
              {activeSession ? (
                <DebugTimeline
                  steps={activeSession.steps}
                  currentStepIndex={activeSession.currentStepIndex}
                  onStepClick={(index) => setCurrentStep(activeSession.id, index)}
                />
              ) : (
                <div className="text-gray-400 text-center py-8">No active debug session</div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Step Details</h3>
              {currentStep ? (
                <div className="bg-white border rounded-lg p-4">
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-gray-600">Type:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {currentStep.type}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-gray-600 mb-1">Content:</div>
                    <div className="p-3 bg-gray-50 rounded text-sm font-mono whitespace-pre-wrap">
                      {currentStep.content}
                    </div>
                  </div>

                  {currentStep.toolInput && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-gray-600 mb-1">Tool Input:</div>
                      <pre className="p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(currentStep.toolInput, null, 2)}
                      </pre>
                    </div>
                  )}

                  {currentStep.toolOutput && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-gray-600 mb-1">Tool Output:</div>
                      <pre className="p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(currentStep.toolOutput, null, 2)}
                      </pre>
                    </div>
                  )}

                  {activeSession?.variables && Object.keys(activeSession.variables).length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Variables:</div>
                      <pre className="p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(activeSession.variables, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">Select a step to view details</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
