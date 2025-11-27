import React, { useState } from 'react';
import { X, MessageSquare, Bug, Lightbulb, Loader2, Send } from 'lucide-react';
import { notifySuccess } from './ToastSystem';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<'bug' | 'feature'>('feature');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Feedback submitted:', { type, message, email });
      notifySuccess("Thanks for your feedback! We'll look into it.");
      setIsSubmitting(false);
      setMessage('');
      setType('feature');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="feedback-title"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h3 id="feedback-title" className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Send Feedback
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
            aria-label="Close feedback modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           {/* Type Selector */}
           <div className="flex gap-3 p-1 bg-slate-950 rounded-lg border border-slate-800">
             <button
               type="button"
               onClick={() => setType('feature')}
               className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${type === 'feature' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <Lightbulb className="w-4 h-4" /> Feature
             </button>
             <button
               type="button"
               onClick={() => setType('bug')}
               className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all focus:ring-2 focus:ring-red-500 outline-none ${type === 'bug' ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <Bug className="w-4 h-4" /> Bug Report
             </button>
           </div>

           <div>
             <label htmlFor="feedback-message" className="block text-xs font-medium text-slate-400 uppercase mb-1">Message</label>
             <textarea
               id="feedback-message"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder-slate-600"
               placeholder={type === 'feature' ? "I'd love to see a feature that..." : "I found a bug when..."}
               required
             />
           </div>

           <div>
             <label htmlFor="feedback-email" className="block text-xs font-medium text-slate-400 uppercase mb-1">Email (Optional)</label>
             <input
               id="feedback-email"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600"
               placeholder="If you'd like us to follow up..."
             />
           </div>

           <div className="flex justify-end pt-2">
             <button
               type="submit"
               disabled={isSubmitting || !message.trim()}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 outline-none"
             >
               {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
               Submit
             </button>
           </div>
        </form>
      </div>
    </div>
  );
};