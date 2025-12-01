/**
 * Filename: CollaborativeEditor.tsx
 * Purpose: Real-time collaborative text editor with presence indicators
 * 
 * Key Components:
 * - Live cursor positions
 * - User presence avatars
 * - Conflict-free editing
 * - Change broadcasting
 * 
 * Dependencies: collaborationStore, websocketService
 */

import React, { useEffect, useRef, useState } from 'react';
import { Users } from 'lucide-react';
import { useCollaborationStore } from '../store/collaborationStore';
import { wsService } from '../services/websocketService';

interface CollaborativeEditorProps {
  promptId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  promptId,
  value,
  onChange,
  placeholder
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const { currentUser, updatePresence, getActiveUsers } = useCollaborationStore();
  const activeUsers = getActiveUsers();

  useEffect(() => {
    if (!currentUser) return;

    // Broadcast cursor position
    const handleSelectionChange = () => {
      if (textareaRef.current) {
        const { selectionStart, selectionEnd } = textareaRef.current;
        updatePresence(currentUser.id, {
          cursorPosition: selectionStart,
          selection: selectionStart !== selectionEnd 
            ? { start: selectionStart, end: selectionEnd }
            : undefined
        });
      }
    };

    textareaRef.current?.addEventListener('select', handleSelectionChange);
    textareaRef.current?.addEventListener('click', handleSelectionChange);

    return () => {
      textareaRef.current?.removeEventListener('select', handleSelectionChange);
      textareaRef.current?.removeEventListener('click', handleSelectionChange);
    };
  }, [currentUser, updatePresence]);

  useEffect(() => {
    // Listen for remote changes
    const handleRemoteChange = (data: { promptId: string; content: string; userId: string }) => {
      if (data.promptId === promptId && data.userId !== currentUser?.id) {
        setLocalValue(data.content);
        onChange(data.content);
      }
    };

    wsService.on('content-update', handleRemoteChange);
    return () => wsService.off('content-update', handleRemoteChange);
  }, [promptId, currentUser, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);

    // Broadcast change
    if (currentUser) {
      wsService.send('content-update', {
        promptId,
        content: newValue,
        userId: currentUser.id
      });
    }
  };

  return (
    <div className="relative">
      {/* Active Users */}
      {activeUsers.length > 0 && (
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg z-10">
          <Users className="w-4 h-4 text-slate-400" />
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 5).map(user => (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-medium text-white"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.name.charAt(0)}
              </div>
            ))}
          </div>
          {activeUsers.length > 5 && (
            <span className="text-xs text-slate-400">+{activeUsers.length - 5}</span>
          )}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-64 px-4 py-3 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none resize-none font-mono text-sm"
      />
    </div>
  );
};
