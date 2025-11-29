import React, { useState, useMemo } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { PROMPT_RECIPES, PromptRecipe } from '../utils/promptRecipes';
import { DomainType } from '../types';
import { trackEvent } from '../utils/analytics';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (template: string, domain: DomainType) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ isOpen, onClose, onApply }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DomainType | 'all'>('all');
  const [preview, setPreview] = useState<PromptRecipe | null>(null);

  const filtered = useMemo(() => {
    return PROMPT_RECIPES.filter(r => {
      const matchSearch = r.label.toLowerCase().includes(search.toLowerCase()) || 
                         r.description.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || r.domain === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const handleApply = (recipe: PromptRecipe) => {
    onApply(recipe.template, recipe.domain);
    trackEvent('template_applied', { template_id: recipe.id, domain: recipe.domain });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl w-full max-w-4xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Template Gallery</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-slate-700 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {Object.values(DomainType).map(d => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === d ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(recipe => (
                <div
                  key={recipe.id}
                  className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => setPreview(recipe)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{recipe.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm mb-1">{recipe.label}</h3>
                      <p className="text-xs text-slate-400 mb-2">{recipe.description}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded">{recipe.domain}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(recipe);
                    }}
                    className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {preview && (
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-slate-800 border border-slate-600 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{preview.icon}</span>
                  <h3 className="font-semibold text-white">{preview.label}</h3>
                </div>
                <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{preview.template}</pre>
              </div>
              <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApply(preview);
                    setPreview(null);
                  }}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
