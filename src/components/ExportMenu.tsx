import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileJson, FileCode, ChevronDown, Check, Layers, Sparkles, FileInput } from 'lucide-react';

export type ExportFormat = 'markdown' | 'json' | 'pdf' | 'text';
export type ExportScope = 'all' | 'enhanced' | 'original';

interface ExportMenuProps {
  onExport: (format: ExportFormat, scope: ExportScope) => void;
  disabled?: boolean;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ onExport, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scope, setScope] = useState<ExportScope>('all');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (format: ExportFormat) => {
    onExport(format, scope);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:ring-2 focus:ring-indigo-500 outline-none
          ${disabled 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-transparent' 
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent hover:border-slate-600'}
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Export options"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          
          {/* Scope Selector */}
          <div className="p-2 border-b border-slate-800 bg-slate-950/30">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Content Scope</div>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setScope('all')}
                className={`flex-1 py-1.5 rounded-md text-[10px] font-medium flex items-center justify-center gap-1 transition-all ${scope === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Export both original input and enhanced output"
              >
                <Layers className="w-3 h-3" />
                All
              </button>
              <button 
                onClick={() => setScope('enhanced')}
                className={`flex-1 py-1.5 rounded-md text-[10px] font-medium flex items-center justify-center gap-1 transition-all ${scope === 'enhanced' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Export enhanced output only"
              >
                <Sparkles className="w-3 h-3" />
                Output
              </button>
              <button 
                onClick={() => setScope('original')}
                className={`flex-1 py-1.5 rounded-md text-[10px] font-medium flex items-center justify-center gap-1 transition-all ${scope === 'original' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Export original input only"
              >
                <FileInput className="w-3 h-3" />
                Input
              </button>
            </div>
          </div>

          <div className="p-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Format</div>
            
            <button onClick={() => handleSelect('markdown')} className="w-full flex items-center gap-3 px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group">
              <FileCode className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
              <div className="flex flex-col">
                <span className="font-medium">Markdown</span>
                <span className="text-[10px] text-slate-500">.md file</span>
              </div>
            </button>

            <button onClick={() => handleSelect('json')} className="w-full flex items-center gap-3 px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group">
              <FileJson className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400" />
              <div className="flex flex-col">
                <span className="font-medium">JSON Data</span>
                <span className="text-[10px] text-slate-500">Structured .json</span>
              </div>
            </button>

            <button onClick={() => handleSelect('pdf')} className="w-full flex items-center gap-3 px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group">
              <FileText className="w-4 h-4 text-red-500 group-hover:text-red-400" />
              <div className="flex flex-col">
                <span className="font-medium">PDF Document</span>
                <span className="text-[10px] text-slate-500">Visual snapshot (All)</span>
              </div>
            </button>

             <button onClick={() => handleSelect('text')} className="w-full flex items-center gap-3 px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group">
              <div className="w-4 h-4 flex items-center justify-center font-mono font-bold text-slate-400">T</div>
              <div className="flex flex-col">
                <span className="font-medium">Plain Text</span>
                <span className="text-[10px] text-slate-500">Simple .txt</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};