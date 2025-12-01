import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChainNode } from '../../store/chainStore';

export const PromptNode: React.FC<NodeProps<ChainNode['data']>> = ({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[200px] ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-blue-500" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <div className="font-semibold text-sm text-gray-900">{data.label}</div>
      </div>
      
      {data.promptContent && (
        <div className="text-xs text-gray-600 line-clamp-2 mt-1">
          {data.promptContent}
        </div>
      )}
      
      {data.output && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
          ✓ Executed
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-blue-500" />
    </div>
  );
};
