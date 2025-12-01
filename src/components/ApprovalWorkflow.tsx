/**
 * Filename: ApprovalWorkflow.tsx
 * Purpose: Review and approval workflow for prompts
 * 
 * Key Components:
 * - Request review
 * - Approve/reject
 * - Review status
 * - Reviewer assignment
 * 
 * Dependencies: collaborationStore, lucide-react
 */

import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'changes-requested';

export interface Review {
  id: string;
  promptId: string;
  requesterId: string;
  reviewerId?: string;
  status: ReviewStatus;
  feedback?: string;
  createdAt: number;
  updatedAt: number;
}

interface ApprovalWorkflowProps {
  promptId: string;
  currentUserId: string;
  onRequestReview: (reviewerId: string) => void;
  onApprove: (feedback?: string) => void;
  onReject: (feedback: string) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  promptId,
  currentUserId,
  onRequestReview,
  onApprove,
  onReject
}) => {
  const [showRequest, setShowRequest] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedReviewer, setSelectedReviewer] = useState('');

  // Mock data - in real app, fetch from store
  const review: Review | null = null;
  const availableReviewers = [
    { id: 'user1', name: 'Alice Johnson' },
    { id: 'user2', name: 'Bob Smith' },
    { id: 'user3', name: 'Carol Davis' }
  ];

  const handleRequestReview = () => {
    if (selectedReviewer) {
      onRequestReview(selectedReviewer);
      setShowRequest(false);
      setSelectedReviewer('');
    }
  };

  const handleApprove = () => {
    onApprove(feedback || undefined);
    setShowReview(false);
    setFeedback('');
  };

  const handleReject = () => {
    if (feedback.trim()) {
      onReject(feedback);
      setShowReview(false);
      setFeedback('');
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <UserCheck className="w-5 h-5" />
        Review & Approval
      </h3>

      {!review ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">No active review for this prompt</p>
          <button
            onClick={() => setShowRequest(true)}
            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            Request Review
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <ReviewStatusCard review={review} />
          
          {review.reviewerId === currentUserId && review.status === 'pending' && (
            <button
              onClick={() => setShowReview(true)}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Review Now
            </button>
          )}
        </div>
      )}

      {/* Request Review Modal */}
      {showRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRequest(false)}>
          <div className="bg-slate-800 rounded-lg p-6 w-96" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Request Review</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Reviewer
              </label>
              <select
                value={selectedReviewer}
                onChange={(e) => setSelectedReviewer(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Choose a reviewer...</option>
                {availableReviewers.map(reviewer => (
                  <option key={reviewer.id} value={reviewer.id}>
                    {reviewer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRequestReview}
                disabled={!selectedReviewer}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowRequest(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowReview(false)}>
          <div className="bg-slate-800 rounded-lg p-6 w-96" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Review Prompt</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Feedback (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add your feedback..."
                className="w-full px-3 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none resize-none h-24"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={handleReject}
                disabled={!feedback.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewStatusCard: React.FC<{ review: Review }> = ({ review }) => {
  const statusConfig = {
    pending: { icon: Clock, color: 'yellow', label: 'Pending Review' },
    approved: { icon: CheckCircle, color: 'green', label: 'Approved' },
    rejected: { icon: XCircle, color: 'red', label: 'Rejected' },
    'changes-requested': { icon: XCircle, color: 'orange', label: 'Changes Requested' }
  }[review.status];

  const Icon = statusConfig.icon;

  return (
    <div className={`p-3 rounded-lg bg-${statusConfig.color}-900/20 border border-${statusConfig.color}-500`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 text-${statusConfig.color}-400`} />
        <span className={`text-sm font-medium text-${statusConfig.color}-400`}>
          {statusConfig.label}
        </span>
      </div>
      {review.feedback && (
        <p className="text-sm text-slate-300">{review.feedback}</p>
      )}
    </div>
  );
};
