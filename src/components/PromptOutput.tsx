import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Copy, Check, Terminal, FileText, Share2, Link, ChevronDown, ChevronRight } from 'lucide-react';
import { OutputPreviewSkeleton } from './Loaders';
import { ProgressBar, ThinkingSteps } from './LoadingPrimitives';
import { ExportMenu, ExportFormat, ExportScope } from './ExportMenu';
import { exportMarkdown, exportJSON, exportPDF, exportText } from '../utils/exportUtils';
import { EnhancementOptions } from '../types';
import { notifySuccess, notifyError, toast } from './ToastSystem';
import DOMPurify from 'dompurify';

interface PromptOutputProps {
  enhancedPrompt: string | null;
  originalPrompt: string | null;
  options: EnhancementOptions;
  onShare?: () => void;
  onChainPrompt?: (output: string) => void;
  isLoading?: boolean;
}

const PromptOutput: React.FC<PromptOutputProps> = ({ 
  enhancedPrompt, 
  originalPrompt, 
  options, 
  onShare, 
  onChainPrompt,
  isLoading = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [progress, setProgress] = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);

  // Simulated progress for "Thinking" state before first token arrives
  useEffect(() => {
    let interval: any;
    if (isLoading && !enhancedPrompt) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 2;
          if (prev < 90) return prev + 0.5;
          return prev;
        });
      }, 100);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [isLoading, enhancedPrompt]);

  // Trigger Prism highlight
  useEffect(() => {
    if (enhancedPrompt && (window as any).Prism) {
      setTimeout(() => {
        (window as any).Prism.highlightAll();
      }, 0);
    }
  }, [enhancedPrompt]);

  useEffect(() => {
    setShowOriginal(false);
  }, [originalPrompt]);

  const handleCopy = () => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      notifySuccess("Copied to clipboard");
    }
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare();
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleExport = async (format: ExportFormat, scope: ExportScope) => {
    if (!enhancedPrompt || !originalPrompt) return;

    const data = {
      input: originalPrompt,
      output: enhancedPrompt,
      options,
      scope
    };

    try {
      if (format === 'markdown') {
        exportMarkdown(data);
        notifySuccess(`Downloaded Markdown (${scope})`);
      } else if (format === 'json') {
        exportJSON(data);
        notifySuccess(`Downloaded JSON (${scope})`);
      } else if (format === 'text') {
        exportText(data);
        notifySuccess(`Downloaded Text (${scope})`);
      } else if (format === 'pdf') {
        // PDF is always a visual snapshot of the output component
        if (outputRef.current) {
          const loadingToast = toast.loading("Generating PDF...");
          await exportPDF(outputRef.current, options);
          toast.dismiss(loadingToast);
          notifySuccess("Downloaded PDF");
        }
      }
    } catch (e) {
      notifyError("Export failed. Please try again.");
    }
  };

  // Render markdown using Marked.js and sanitize with DOMPurify (memoized)
  const renderedMarkdown = useMemo(() => {
    if (!enhancedPrompt) return "";
    if (!(window as any).marked) return enhancedPrompt;
    
    // Parse Markdown to HTML
    const rawHtml = (window as any).marked.parse(enhancedPrompt);
    
    // Sanitize HTML
    return DOMPurify.sanitize(rawHtml);
  }, [enhancedPrompt]);

  if (!enhancedPrompt && !originalPrompt && !isLoading) {
    return (
      <div className="h-full bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center border-dashed">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Terminal className="w-8 h-8 text-slate-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Ready to Enhance</h3>
        <p className="text-slate-500 max-w-sm text-sm">
          Enter your rough design or coding ideas on the left, and watch them transform into professional specifications here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-800 flex items-center justify-between shrink-0 flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
          <FileText className="w-4 h-4" aria-hidden="true" />
          Enhanced Output
        </h2>
        
        <div className="flex items-center gap-2 flex-wrap">
           {/* Chain Prompt Button */}
           {onChainPrompt && enhancedPrompt && (
            <button
              onClick={() => onChainPrompt(enhancedPrompt)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600 transition-all focus:ring-2 focus:ring-blue-500 outline-none"
              title="Use this output as input for the next prompt"
            >
              <Link className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chain</span>
            </button>
           )}

          {/* Share Button */}
          {onShare && (
            <button
              onClick={handleShareClick}
              disabled={!enhancedPrompt}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 outline-none
                ${shared
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' 
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'}
              `}
              title="Create a shareable link"
            >
              {shared ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Linked</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Share</span>
                </>
              )}
            </button>
          )}
          
          {/* Export Dropdown */}
          <ExportMenu onExport={handleExport} disabled={!enhancedPrompt} />

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!enhancedPrompt}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 outline-none
              ${copied 
                ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'}
            `}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-0 relative group bg-slate-900">
        
        {/* Collapsible Original Prompt Section */}
        {originalPrompt && (
           <div className="border-b border-slate-700 bg-slate-800/50">
             <button 
               onClick={() => setShowOriginal(!showOriginal)}
               className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/50 transition-colors text-left group/btn focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
               aria-expanded={showOriginal}
             >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider group-hover/btn:text-slate-300 transition-colors">
                  {showOriginal ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Original Input
                </div>
                {!showOriginal && (
                    <p className="text-xs text-slate-400 italic line-clamp-1 flex-1 ml-4 opacity-70">
                        {originalPrompt}
                    </p>
                )}
             </button>
             
             {showOriginal && (
               <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                 <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 shadow-inner">
                   <div className="text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap break-words">
                     {originalPrompt}
                   </div>
                 </div>
               </div>
             )}
           </div>
        )}

        <div className="p-4 sm:p-6" ref={outputRef}>
          {/* Loading State: Thinking Phase */}
          {isLoading && !enhancedPrompt && (
            <div className="space-y-6 animate-in fade-in duration-300">
               {options.useThinking ? (
                 <ThinkingSteps />
               ) : (
                 <ProgressBar progress={progress} label="Generating..." />
               )}
               <OutputPreviewSkeleton />
            </div>
          )}

          {enhancedPrompt ? (
            <div 
              className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-headings:text-blue-300 prose-a:text-blue-400 prose-strong:text-blue-200 prose-code:text-blue-300"
              dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PromptOutput;