import React, { useState } from 'react';
import { Bug, Palette, Zap, MessageSquare, Calendar } from 'lucide-react';
import { StarRating } from './StarRating';

interface DetailedFeedbackFormProps {
  onSubmit: (feedback: FeedbackData) => void;
  onCancel: () => void;
}

export interface FeedbackData {
  category: 'ui' | 'features' | 'bugs' | 'general';
  rating: number;
  title: string;
  description: string;
  email?: string;
  scheduleInterview?: boolean;
}

export const DetailedFeedbackForm: React.FC<DetailedFeedbackFormProps> = ({ onSubmit, onCancel }) => {
  const [data, setData] = useState<FeedbackData>({
    category: 'general',
    rating: 0,
    title: '',
    description: '',
    scheduleInterview: false
  });

  const categories = [
    { id: 'ui', label: 'UI/UX', icon: <Palette className="w-5 h-5" /> },
    { id: 'features', label: 'Features', icon: <Zap className="w-5 h-5" /> },
    { id: 'bugs', label: 'Bugs', icon: <Bug className="w-5 h-5" /> },
    { id: 'general', label: 'General', icon: <MessageSquare className="w-5 h-5" /> }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">Category</label>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setData({ ...data, category: cat.id as any })}
              className={`p-3 rounded-lg border-2 transition-all ${
                data.category === cat.id
                  ? 'border-accent-primary bg-accent-primary/10'
                  : 'border-border hover:border-accent-primary/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {cat.icon}
                <span className="font-medium">{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Overall Rating</label>
        <StarRating value={data.rating} onChange={(rating) => setData({ ...data, rating })} size="lg" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="Brief summary of your feedback"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder="Provide detailed feedback..."
          className="w-full h-32 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary outline-none resize-none"
          required
        />
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.scheduleInterview}
            onChange={(e) => setData({ ...data, scheduleInterview: e.target.checked })}
            className="w-4 h-4 text-accent-primary rounded focus:ring-2 focus:ring-accent-primary"
          />
          <Calendar className="w-4 h-4" />
          <span className="text-sm">I'm interested in a user interview</span>
        </label>
      </div>

      {data.scheduleInterview && (
        <div>
          <label className="block text-sm font-medium mb-2">Email (for interview scheduling)</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="your@email.com"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary outline-none"
            required={data.scheduleInterview}
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-elevated transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!data.title || !data.description || data.rating === 0}
          className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit Feedback
        </button>
      </div>
    </form>
  );
};
