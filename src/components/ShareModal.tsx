import React, { useState } from 'react';
import { X, Copy, Check, Share2, Download } from 'lucide-react';
import { generateShareLink } from '../utils/shareUtils';
import { exportMarkdown, exportJSON, copyToClipboard } from '../utils/exportUtils';
import { trackEvent } from '../utils/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  original: string;
  enhanced: string;
  options: any;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  original,
  enhanced,
  options
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareLink = generateShareLink({ input: original, enhancedPrompt: enhanced, originalPrompt: original, options });

  const handleCopy = async () => {
    await copyToClipboard(shareLink);
    setCopied(true);
    trackEvent('prompt_shared', { method: 'link' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMD = () => {
    exportMarkdown({ input: original, output: enhanced, options });
  };

  const handleExportJSON = () => {
    exportJSON({ input: original, output: enhanced, options });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Share & Export</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase mb-2">
              Export As
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleExportMD}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700"
              >
                <Download className="w-4 h-4" />
                Markdown
              </button>
              <button
                onClick={handleExportJSON}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
