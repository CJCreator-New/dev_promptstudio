import React from 'react';
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const recentPages = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Templates', path: '/templates', icon: FileQuestion },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-500/10 rounded-full mb-6">
            <FileQuestion className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-200 mb-3">
            Page Not Found
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">
            Here's what you can do:
          </h3>
          <div className="grid gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-left group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <div>
                <div className="text-sm font-medium text-white">Go Back</div>
                <div className="text-xs text-slate-400">Return to previous page</div>
              </div>
            </button>

            <a
              href="/"
              className="flex items-center gap-3 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-left group"
            >
              <Home className="w-5 h-5 text-white" />
              <div>
                <div className="text-sm font-medium text-white">Go Home</div>
                <div className="text-xs text-indigo-200">Start from the homepage</div>
              </div>
            </a>
          </div>
        </div>

        <div className="text-left bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Search className="w-4 h-4" />
            <span>Quick Links</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentPages.map((page) => (
              <a
                key={page.path}
                href={page.path}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 hover:text-white transition-colors"
              >
                <page.icon className="w-3 h-3" />
                {page.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
