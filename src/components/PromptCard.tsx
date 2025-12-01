/**
 * Filename: PromptCard.tsx
 * Purpose: Display marketplace prompt with rating and actions
 * 
 * Key Features:
 * - Rating display
 * - Download button
 * - Preview modal
 * - Premium badge
 * 
 * Dependencies: marketplaceStore, lucide-react
 */

import React, { useState } from 'react';
import { Star, Download, Eye, Tag, DollarSign } from 'lucide-react';
import { MarketplacePrompt, useMarketplaceStore } from '../store/marketplaceStore';

interface Props {
  prompt: MarketplacePrompt;
}

export const PromptCard: React.FC<Props> = ({ prompt }) => {
  const [showPreview, setShowPreview] = useState(false);
  const { incrementDownloads } = useMarketplaceStore();

  const handleDownload = () => {
    incrementDownloads(prompt.id);
    // Copy to clipboard or download
    navigator.clipboard.writeText(prompt.content);
    alert('Prompt copied to clipboard!');
  };

  return (
    <>
      <div className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-100 mb-1">{prompt.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2">{prompt.description}</p>
          </div>
          {prompt.isPremium && (
            <div className="ml-2 px-2 py-1 bg-yellow-900/20 text-yellow-400 text-xs rounded flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {prompt.price}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {prompt.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{prompt.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{prompt.downloads}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">{prompt.reviews.length} reviews</span>
          </div>
        </div>

        {/* Author */}
        <div className="text-xs text-slate-500 mb-3">
          by {prompt.author}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Use
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PromptPreviewModal prompt={prompt} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
};

const PromptPreviewModal: React.FC<{ prompt: MarketplacePrompt; onClose: () => void }> = ({
  prompt,
  onClose
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { addReview, incrementDownloads } = useMarketplaceStore();

  const handleSubmitReview = () => {
    if (rating > 0) {
      addReview(prompt.id, {
        userId: 'current_user',
        userName: 'Anonymous User',
        rating,
        comment
      });
      setRating(0);
      setComment('');
    }
  };

  const handleUse = () => {
    incrementDownloads(prompt.id);
    navigator.clipboard.writeText(prompt.content);
    alert('Prompt copied to clipboard!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">{prompt.title}</h2>
              <p className="text-slate-400">{prompt.description}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-300">✕</button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Prompt Content */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Prompt</h3>
            <pre className="p-4 bg-slate-900 rounded-lg text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto">
              {prompt.content}
            </pre>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-3">
              Reviews ({prompt.reviews.length})
            </h3>
            {prompt.reviews.length === 0 ? (
              <p className="text-slate-400 text-sm">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-3">
                {prompt.reviews.map(review => (
                  <div key={review.id} className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-slate-100">{review.userName}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-slate-300">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Review */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Leave a Review</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onClick={() => setRating(i)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience (optional)"
                className="w-full px-3 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none resize-none h-20"
              />
              <button
                onClick={handleSubmitReview}
                disabled={rating === 0}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white rounded-lg"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700">
          <button
            onClick={handleUse}
            className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Use This Prompt
          </button>
        </div>
      </div>
    </div>
  );
};
