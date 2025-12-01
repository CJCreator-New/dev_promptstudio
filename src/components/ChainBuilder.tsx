import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useChainStore } from '../store/chainStore';
import { PromptNode } from './nodes/PromptNode';
import { ConditionalNode } from './nodes/ConditionalNode';
import { ChainExecutor } from '../services/chainExecutor';
import { useApiConfigStore } from '../store/apiConfigStore';

const nodeTypes: NodeTypes = {
  prompt: PromptNode,
  conditional: ConditionalNode,
};

export const ChainBuilder: React.FC = () => {
  const { chains, activeChainId, updateNodes, updateEdges, setExecutionResults, isExecuting, setIsExecuting } = useChainStore();
  const { getActiveApiKey } = useApiConfigStore();
  const activeChain = chains.find((c) => c.id === activeChainId);

  const [nodes, setNodes, onNodesChange] = useNodesState(activeChain?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(activeChain?.edges || []);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeConfig, setNodeConfig] = useState({ label: '', promptContent: '', condition: '' });

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      if (activeChainId) updateEdges(activeChainId, newEdges);
    },
    [edges, activeChainId, updateEdges, setEdges]
  );

  const addNode = (type: 'prompt' | 'conditional') => {
    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${type} ${nodes.length + 1}` },
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    if (activeChainId) updateNodes(activeChainId, newNodes);
  };

  const updateNodeData = () => {
    if (!selectedNode) return;
    const newNodes = nodes.map((n) =>
      n.id === selectedNode ? { ...n, data: { ...n.data, ...nodeConfig } } : n
    );
    setNodes(newNodes);
    if (activeChainId) updateNodes(activeChainId, newNodes);
    setSelectedNode(null);
  };

  const executeChain = async () => {
    if (!activeChainId || !activeChain) return;
    const apiKey = getActiveApiKey('google');
    if (!apiKey) {
      alert('Please configure Google API key');
      return;
    }

    setIsExecuting(true);
    const executor = new ChainExecutor();
    try {
      const results = await executor.execute(nodes, edges, apiKey, (nodeId, output) => {
        const newNodes = nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, output } } : n));
        setNodes(newNodes);
      });
      setExecutionResults(activeChainId, results);
    } catch (error) {
      alert(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  if (!activeChain) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select or create a chain to start building
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 p-4 bg-white border-b">
        <button
          onClick={() => addNode('prompt')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Prompt
        </button>
        <button
          onClick={() => addNode('conditional')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          + Conditional
        </button>
        <button
          onClick={executeChain}
          disabled={isExecuting}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-auto"
        >
          {isExecuting ? 'Executing...' : '▶ Execute Chain'}
        </button>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            setSelectedNode(node.id);
            setNodeConfig({
              label: node.data.label || '',
              promptContent: node.data.promptContent || '',
              condition: node.data.condition || '',
            });
          }}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="absolute right-4 top-20 w-80 bg-white border rounded-lg shadow-lg p-4">
          <h3 className="font-semibold mb-3">Edit Node</h3>
          <input
            type="text"
            placeholder="Label"
            value={nodeConfig.label}
            onChange={(e) => setNodeConfig({ ...nodeConfig, label: e.target.value })}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          {nodes.find((n) => n.id === selectedNode)?.type === 'prompt' && (
            <textarea
              placeholder="Prompt content"
              value={nodeConfig.promptContent}
              onChange={(e) => setNodeConfig({ ...nodeConfig, promptContent: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-2 h-32"
            />
          )}
          {nodes.find((n) => n.id === selectedNode)?.type === 'conditional' && (
            <input
              type="text"
              placeholder="Condition (e.g., output.includes('yes'))"
              value={nodeConfig.condition}
              onChange={(e) => setNodeConfig({ ...nodeConfig, condition: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-2"
            />
          )}
          <div className="flex gap-2">
            <button onClick={updateNodeData} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
            <button onClick={() => setSelectedNode(null)} className="flex-1 px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
