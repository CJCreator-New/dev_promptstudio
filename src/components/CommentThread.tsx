/**
 * Filename: CommentThread.tsx
 * Purpose: Comment threads with replies and resolution
 * 
 * Key Components:
 * - Comment list with replies
 * - Add comment/reply
 * - Resolve/unresolve
 * - Delete comments
 * 
 * Dependencies: collaborationStore, lucide-react
 */

import React, { useState } from 'react';
import { MessageSquare, Send, Check, Trash2, MoreVertical } from 'lucide-react';
import { useCollaborationStore, Comment } from '../store/collaborationStore';

interface CommentThreadProps {
  promptId: string;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ promptId }) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const {
    currentUser,
    getComments,
    addComment,
    addReply,
    resolveComment,
    deleteComment
  } = useCollaborationStore();

  const comments = getComments(promptId);
  const unresolvedComments = comments.filter(c => !c.resolved);

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;
    
    addComment({
      promptId,
      userId: currentUser.id,
      content: newComment.trim(),
      resolved: false
    });
    
    setNewComment('');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim() || !currentUser) return;
    
    addReply(commentId, {
      userId: currentUser.id,
      content: replyText.trim()
    });
    
    setReplyText('');
    setReplyTo(null);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments
        </h3>
        <span className="text-sm text-slate-400">
          {unresolvedComments.length} unresolved
        </span>
      </div>

      {/* Add Comment */}
      {currentUser && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none text-sm"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUserId={currentUser?.id}
              onResolve={() => resolveComment(comment.id)}
              onDelete={() => deleteComment(comment.id)}
              onReply={() => setReplyTo(comment.id)}
              replyTo={replyTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={() => handleAddReply(comment.id)}
              formatTime={formatTime}
            />
          ))
        )}
      </div>
    </div>
  );
};

const CommentCard: React.FC<{
  comment: Comment;
  currentUserId?: string;
  onResolve: () => void;
  onDelete: () => void;
  onReply: () => void;
  replyTo: string | null;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmitReply: () => void;
  formatTime: (timestamp: number) => string;
}> = ({
  comment,
  currentUserId,
  onResolve,
  onDelete,
  onReply,
  replyTo,
  replyText,
  setReplyText,
  onSubmitReply,
  formatTime
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`p-3 rounded-lg ${comment.resolved ? 'bg-slate-700/50' : 'bg-slate-700'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium text-white">
            {comment.userId.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-100">
              User {comment.userId.substring(0, 4)}
            </div>
            <div className="text-xs text-slate-400">{formatTime(comment.createdAt)}</div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-slate-600 rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 min-w-32">
              <button
                onClick={() => { onResolve(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <Check className="w-3 h-3" />
                {comment.resolved ? 'Unresolve' : 'Resolve'}
              </button>
              {comment.userId === currentUserId && (
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-300 mb-2">{comment.content}</p>

      {comment.resolved && (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/20 text-green-400 text-xs rounded">
          <Check className="w-3 h-3" />
          Resolved
        </div>
      )}

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-3 ml-4 space-y-2 border-l-2 border-slate-600 pl-3">
          {comment.replies.map(reply => (
            <div key={reply.id} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-slate-300">
                  User {reply.userId.substring(0, 4)}
                </span>
                <span className="text-xs text-slate-400">{formatTime(reply.createdAt)}</span>
              </div>
              <p className="text-slate-300">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Input */}
      {replyTo === comment.id ? (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSubmitReply()}
            placeholder="Write a reply..."
            className="flex-1 px-3 py-1 bg-slate-600 text-slate-100 rounded text-sm border border-slate-500 focus:border-indigo-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onSubmitReply}
            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm"
          >
            Reply
          </button>
        </div>
      ) : (
        <button
          onClick={onReply}
          className="mt-2 text-xs text-indigo-400 hover:text-indigo-300"
        >
          Reply
        </button>
      )}
    </div>
  );
};
