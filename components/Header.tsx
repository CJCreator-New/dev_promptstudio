import React from 'react';
import { Sparkles, Terminal, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onFeedback?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onFeedback }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Terminal className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              DevPrompt<span className="text-indigo-400">Studio</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium hidden sm:block">AI-Powered Engineering Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold" role="status">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            <span>Powered by Gemini 2.5 Flash</span>
          </div>

          {onFeedback && (
            <button
              onClick={onFeedback}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              title="Report a bug or suggest a feature"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Feedback</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;