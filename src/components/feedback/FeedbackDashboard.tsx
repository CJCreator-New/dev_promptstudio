import React, { useState } from 'react';
import { TrendingUp, MessageSquare, Star, Bug, Palette, Zap } from 'lucide-react';
import { StarRating } from './StarRating';

interface FeedbackItem {
  id: string;
  category: string;
  rating: number;
  title: string;
  description: string;
  timestamp: number;
  status: 'new' | 'reviewed' | 'resolved';
}

interface FeedbackDashboardProps {
  feedback: FeedbackItem[];
  onStatusChange: (id: string, status: FeedbackItem['status']) => void;
}

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({ feedback, onStatusChange }) => {
  const [filter, setFilter] = useState<string>('all');

  const stats = {
    total: feedback.length,
    avgRating: feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length || 0,
    byCategory: {
      ui: feedback.filter(f => f.category === 'ui').length,
      features: feedback.filter(f => f.category === 'features').length,
      bugs: feedback.filter(f => f.category === 'bugs').length,
      general: feedback.filter(f => f.category === 'general').length
    }
  };

  const filtered = filter === 'all' ? feedback : feedback.filter(f => f.category === filter);

  const categoryIcons: Record<string, React.ReactNode> = {
    ui: <Palette className="w-4 h-4" />,
    features: <Zap className="w-4 h-4" />,
    bugs: <Bug className="w-4 h-4" />,
    general: <MessageSquare className="w-4 h-4" />
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-elevated border border-border rounded-lg">
          <div className="flex items-center gap-2 text-muted mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Total Feedback</span>
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 bg-elevated border border-border rounded-lg">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Star className="w-4 h-4" />
            <span className="text-sm">Avg Rating</span>
          </div>
          <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
        </div>
        <div className="p-4 bg-elevated border border-border rounded-lg">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Bug className="w-4 h-4" />
            <span className="text-sm">Bug Reports</span>
          </div>
          <div className="text-2xl font-bold">{stats.byCategory.bugs}</div>
        </div>
        <div className="p-4 bg-elevated border border-border rounded-lg">
          <div className="flex items-center gap-2 text-muted mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Feature Requests</span>
          </div>
          <div className="text-2xl font-bold">{stats.byCategory.features}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'ui', 'features', 'bugs', 'general'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === cat
                ? 'bg-accent-primary text-white'
                : 'bg-elevated hover:bg-background'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="p-4 bg-elevated border border-border rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {categoryIcons[item.category]}
                <span className="font-semibold">{item.title}</span>
              </div>
              <StarRating value={item.rating} readonly size="sm" />
            </div>
            <p className="text-sm text-muted mb-3">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
              <select
                value={item.status}
                onChange={(e) => onStatusChange(item.id, e.target.value as any)}
                className="text-xs px-2 py-1 bg-background border border-border rounded"
              >
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
