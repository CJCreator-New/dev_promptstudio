import React, { useState } from 'react';
import { X } from 'lucide-react';
import { StarRating } from './StarRating';

interface SurveyPromptProps {
  question: string;
  trigger: 'onComplete' | 'onTime' | 'onAction';
  onSubmit: (rating: number, comment?: string) => void;
  onDismiss: () => void;
}

export const SurveyPrompt: React.FC<SurveyPromptProps> = ({
  question,
  onSubmit,
  onDismiss
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (newRating <= 3) {
      setShowComment(true);
    }
  };

  const handleSubmit = () => {
    onSubmit(rating, comment || undefined);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-elevated border border-border rounded-xl shadow-2xl p-6 animate-in slide-in-from-bottom-4">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold">{question}</h3>
        <button onClick={onDismiss} className="text-muted hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center mb-4">
        <StarRating value={rating} onChange={handleRatingChange} size="lg" />
      </div>

      {showComment && (
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more (optional)..."
          className="w-full h-20 px-3 py-2 mb-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary outline-none resize-none text-sm"
        />
      )}

      <div className="flex gap-2">
        <button
          onClick={onDismiss}
          className="flex-1 px-4 py-2 text-muted hover:text-foreground transition-colors"
        >
          Not now
        </button>
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
