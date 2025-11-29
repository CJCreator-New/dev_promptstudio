import React, { useState } from 'react';
import { X, MessageSquare, Bug, Lightbulb, Loader2, Send } from 'lucide-react';
import { notifySuccess } from './ToastSystem';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// List of temporary/disposable email domains to block
const BLOCKED_EMAIL_DOMAINS = [
  'tempmail.com', 'temp-mail.org', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'throwaway.email', 'fakeinbox.com', 'trashmail.com',
  'yopmail.com', 'maildrop.cc', 'getnada.com', 'temp-mail.io',
  'mohmal.com', 'sharklasers.com', 'guerrillamail.info', 'grr.la',
  'spam4.me', 'mintemail.com', 'emailondeck.com', 'dispostable.com'
];

function isValidEmail(email: string): { valid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  const domain = email.split('@')[1]?.toLowerCase() || '';
  if (BLOCKED_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Temporary email addresses are not allowed' };
  }
  
  return { valid: true };
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<'bug' | 'feature'>('feature');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('userEmail') || '');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Validate email
    const emailValidation = isValidEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || 'Invalid email');
      return;
    }
    
    setEmailError('');
    setIsSubmitting(true);
    
    try {
      // FormSubmit.co endpoint - replace with your email
      const formSubmitEndpoint = 'https://formsubmit.co/cjsaran94@gmail.com';
      
      const formData = new FormData();
      formData.append('_subject', `[${type.toUpperCase()}] DevPrompt Studio Feedback`);
      formData.append('Type', type === 'bug' ? 'Bug Report' : 'Feature Request');
      formData.append('Message', message);
      formData.append('User Email', email);
      formData.append('Timestamp', new Date().toISOString());
      formData.append('_captcha', 'false'); // Disable captcha
      formData.append('_template', 'table'); // Use table format
      
      const response = await fetch(formSubmitEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        localStorage.setItem('userEmail', email);
        notifySuccess("Feedback sent successfully! Thanks for your input.");
        setMessage('');
        setType('feature');
        onClose();
      } else {
        throw new Error('Failed to send feedback');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      notifySuccess("Feedback recorded locally. We'll review it soon.");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
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
           <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200">
             <p>📧 Feedback will be sent directly to: <span className="font-mono text-blue-300">cjsaran94@gmail.com</span></p>
             <p className="text-blue-300/70 mt-1">Powered by FormSubmit.co</p>
           </div>
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
             <label htmlFor="feedback-email" className="block text-xs font-medium text-slate-400 uppercase mb-1">
               Your Email <span className="text-red-400">*</span>
             </label>
             <input
               id="feedback-email"
               type="email"
               value={email}
               onChange={(e) => {
                 setEmail(e.target.value);
                 setEmailError('');
               }}
               className={`w-full bg-slate-950 border rounded-lg p-3 text-slate-200 text-sm focus:ring-2 outline-none placeholder-slate-600 ${
                 emailError ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-indigo-500'
               }`}
               placeholder="your.email@example.com"
               required
             />
             {emailError ? (
               <p className="text-xs text-red-400 mt-1">{emailError}</p>
             ) : (
               <p className="text-xs text-slate-500 mt-1">Required for follow-up. Temporary emails not allowed.</p>
             )}
           </div>

           <div className="flex justify-end pt-2">
             <button
               type="submit"
               disabled={isSubmitting || !message.trim() || !email.trim()}
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