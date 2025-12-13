import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

interface FeedbackWidgetProps {
  onSubmit: (feedback: { type: string; message: string; rating?: number }) => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSubmit({ type, message });
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-accent-primary text-white rounded-full shadow-lg hover:bg-accent-primary-hover transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Open feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-elevated border border-border rounded-xl shadow-2xl p-6 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Send Feedback</h3>
            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary outline-none"
          >
            <option value="general">General Feedback</option>
            <option value="bug">Report Bug</option>
            <option value="feature">Feature Request</option>
            <option value="ui">UI/UX Issue</option>
          </select>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you think..."
            className="w-full h-32 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary outline-none resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="w-full mt-3 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </>
  );
};
