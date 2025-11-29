import React, { useState } from 'react';
import { Sparkles, Terminal, MessageSquare, Key, X, LogOut } from 'lucide-react';
import { ApiKeyManager } from './settings/ApiKeyManager';
import { clearUserSession, getUserSession } from '../utils/auth';

interface HeaderProps {
  onFeedback?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(({ onFeedback, onLogout }) => {
  const [showApiKeys, setShowApiKeys] = useState(false);
  const userSession = getUserSession();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? Your data will remain saved locally.')) {
      clearUserSession();
      onLogout?.();
    }
  };

  return (
    <>
    <header className="border-b border-slate-700 bg-slate-800 backdrop-blur-md sticky top-0 z-50 shadow-sm" role="banner">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg shadow-lg">
            <Terminal className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight" id="app-title">
              DevPrompt<span className="text-blue-400">Studio</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium hidden sm:block">AI-Powered Engineering Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {userSession && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 text-xs" title="Logged in as">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                {userSession.email.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{userSession.email}</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold" role="status">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            <span>Powered by Gemini 2.5 Flash</span>
          </div>

          <button
            onClick={() => setShowApiKeys(true)}
            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg border border-slate-600 hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-900 outline-none min-h-[44px]"
            aria-label="Manage API Keys"
            title="Manage API Keys"
          >
            <Key className="w-3.5 h-3.5" />
            <span>API Keys</span>
          </button>

          {onFeedback && (
            <button
              onClick={onFeedback}
              className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg border border-slate-600 hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-900 outline-none"
              aria-label="Report a bug or suggest a feature"
              title="Report a bug or suggest a feature"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Feedback</span>
            </button>
          )}

          {userSession && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-medium text-red-300 hover:text-red-200 transition-colors bg-red-900/20 hover:bg-red-900/30 px-3 py-2 rounded-lg border border-red-500/30 hover:border-red-500/50 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-slate-900 outline-none min-h-[44px]"
              aria-label="Logout"
              title={`Logout (${userSession.email})`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>

    {showApiKeys && (
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowApiKeys(false)}></div>
        <div className="relative bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl shadow-2xl my-8 animate-in zoom-in-95 duration-200">
          <div className="sticky top-0 px-6 py-4 border-b border-slate-700 bg-slate-900 flex items-center justify-between z-10">
            <h2 className="text-lg font-semibold text-white">API Key Management</h2>
            <button
              onClick={() => setShowApiKeys(false)}
              className="text-slate-400 hover:text-white transition-colors focus:ring-2 focus:ring-blue-500 rounded-lg p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-800 hover:bg-slate-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <ApiKeyManager />
        </div>
      </div>
    )}
    </>
  );
});

Header.displayName = 'Header';

export default Header;