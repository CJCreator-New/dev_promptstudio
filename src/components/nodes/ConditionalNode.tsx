import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChainNode } from '../../store/chainStore';

export const ConditionalNode: React.FC<NodeProps<ChainNode['data']>> = ({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[200px] ${
        selected ? 'border-yellow-500' : 'border-gray-300'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-yellow-500" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="font-semibold text-sm text-gray-900">{data.label}</div>
      </div>
      
      {data.condition && (
        <div className="text-xs text-gray-600 font-mono mt-1">
          {data.condition}
        </div>
      )}
      
      <div className="flex justify-between mt-3">
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="w-3 h-3 !bg-green-500 !left-[25%]"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="w-3 h-3 !bg-red-500 !left-[75%]"
        />
      </div>
      
      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        <span>True</span>
        <span>False</span>
      </div>
    </div>
  );
};
