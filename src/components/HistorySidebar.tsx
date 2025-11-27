import React, { useState, useMemo } from 'react';
import { HistoryItem, SavedProject, CustomTemplate, DomainType, GenerationMode } from '../types';
import { History, Clock, Trash2, Folder, LayoutTemplate, Edit3, Search, Plus, Sparkles, Wand2, FileText } from 'lucide-react';
import { HistoryEmptyState, ProjectsEmptyState, TemplatesEmptyState } from './EmptyStates';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { debounce } from '../utils/performance';

interface HistorySidebarProps {
  history: HistoryItem[];
  savedProjects: SavedProject[];
  customTemplates: CustomTemplate[];
  onSelectHistory: (item: HistoryItem) => void;
  onSelectProject: (item: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  onSelectTemplate: (item: CustomTemplate) => void;
  onEditTemplate: (item: CustomTemplate) => void;
  onCreateTemplate: () => void;
  onDeleteTemplate: (id: string) => void;
  onClearHistory: () => void;
  onLoadExample?: () => void;
  onStartProject?: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  savedProjects, 
  customTemplates,
  onSelectHistory, 
  onSelectProject, 
  onDeleteProject,
  onSelectTemplate,
  onEditTemplate,
  onCreateTemplate,
  onDeleteTemplate,
  onClearHistory,
  onLoadExample,
  onStartProject
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'projects' | 'templates'>('history');
  const [templateSearch, setTemplateSearch] = useState('');

  const handleSearchChange = useMemo(
    () => debounce((value: string) => setTemplateSearch(value), 300),
    []
  );

  const groupedTemplates = useMemo<Record<string, CustomTemplate[]>>(() => {
    if (activeTab !== 'templates') return {};

    const filtered = customTemplates.filter(t => 
      t.name.toLowerCase().includes(templateSearch.toLowerCase()) || 
      t.text.toLowerCase().includes(templateSearch.toLowerCase())
    );

    const groups: Record<string, CustomTemplate[]> = {};
    filtered.forEach(t => {
      const domain = t.domain || DomainType.FRONTEND; 
      if (!groups[domain]) groups[domain] = [];
      groups[domain].push(t);
    });

    return groups;
  }, [customTemplates, templateSearch, activeTab]);

  const HistoryRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = history[index];
    return (
      <div style={style} className="px-1 py-1">
        <button
          onClick={() => onSelectHistory(item)}
          className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 transition-all group focus:ring-2 focus:ring-indigo-500 outline-none h-full"
        >
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{item.domain.split(' ')[0]}</span>
            <div className="flex items-center gap-1.5">
               {item.mode === GenerationMode.BASIC ? (
                 <Wand2 className="w-3 h-3 text-slate-400" title="Basic Refinement" />
               ) : item.mode === GenerationMode.OUTLINE ? (
                 <FileText className="w-3 h-3 text-emerald-400" title="Structured Outline" />
               ) : (
                 <Sparkles className="w-3 h-3 text-purple-400" title="Prompt Enhancement" />
               )}
               <span className="text-[10px] text-slate-500">
                {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-medium line-clamp-2 mb-1 group-hover:text-white transition-colors">
            {item.original}
          </p>
        </button>
      </div>
    );
  };

  const ProjectRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const project = savedProjects[index];
    return (
      <div style={style} className="px-1 py-1">
        <div className="w-full h-full rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
          <button onClick={() => onSelectProject(project)} className="w-full h-full text-left p-3 pr-8 focus:ring-2 focus:ring-indigo-500 outline-none rounded-lg">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[11px] font-bold text-indigo-300 truncate pr-2">{project.name}</span>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-1 mb-1">
              {project.input.substring(0, 40)}...
            </p>
            <div className="flex gap-2 mt-1">
                <span className="px-1.5 py-0.5 bg-slate-700 rounded text-[9px] text-slate-300">{project.options.domain.split(' ')[0]}</span>
                {project.options.useThinking && (
                  <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px]">Thinking</span>
                )}
            </div>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
            className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-red-500 rounded"
            aria-label={`Delete project ${project.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  };

  const flattenedTemplates = useMemo(() => {
    const flat: Array<{ type: 'header' | 'item', data: any, domain?: string }> = [];
    Object.entries(groupedTemplates).forEach(([domain, templates]) => {
      flat.push({ type: 'header', data: domain, domain });
      (templates as CustomTemplate[]).forEach(t => flat.push({ type: 'item', data: t }));
    });
    return flat;
  }, [groupedTemplates]);

  const TemplateRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = flattenedTemplates[index];
    
    if (item.type === 'header') {
      return (
        <div style={style} className="px-1 pt-4 pb-1">
           <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-indigo-500" aria-hidden="true"></span>
            {item.data}
          </h3>
        </div>
      );
    }

    const template = item.data as CustomTemplate;
    return (
      <div style={style} className="px-1 py-1">
         <div className="w-full h-full rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
            <button onClick={() => onSelectTemplate(template)} className="w-full h-full text-left p-3 pr-16 focus:ring-2 focus:ring-indigo-500 outline-none rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[11px] font-bold text-indigo-300 truncate">{template.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2 mb-1">
                {template.text}
              </p>
            </button>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-slate-800/80 rounded p-0.5 backdrop-blur-sm">
              <button 
                onClick={(e) => { e.stopPropagation(); onEditTemplate(template); }}
                className="p-1 text-slate-400 hover:text-indigo-400 transition-colors focus:ring-2 focus:ring-indigo-500 rounded"
                title="Edit Template"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteTemplate(template.id); }}
                className="p-1 text-slate-400 hover:text-red-400 transition-colors focus:ring-2 focus:ring-red-500 rounded"
                title="Delete Template"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 w-80 fixed right-0 top-16 bottom-0 z-40 transform transition-transform duration-300 translate-x-full lg:translate-x-0 lg:static lg:w-72 lg:border-l-0 lg:border-r lg:rounded-l-2xl">
      <div className="flex border-b border-slate-800 shrink-0" role="tablist">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors relative focus:outline-none focus:bg-slate-800 ${activeTab === 'history' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          title="Recent History"
        >
          <History className="w-4 h-4" />
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>}
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors relative focus:outline-none focus:bg-slate-800 ${activeTab === 'projects' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          title="Saved Projects"
        >
          <Folder className="w-4 h-4" />
          {activeTab === 'projects' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>}
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors relative focus:outline-none focus:bg-slate-800 ${activeTab === 'templates' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          title="Custom Templates"
        >
          <LayoutTemplate className="w-4 h-4" />
          {activeTab === 'templates' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>}
        </button>
      </div>

      <div className="flex-1 p-3 overflow-hidden" role="tabpanel">
        
        {activeTab === 'history' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2 shrink-0 px-1">
              {history.length > 0 && <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Last 50 items</span>}
              {history.length > 0 && (
                <button onClick={onClearHistory} className="text-slate-500 hover:text-red-400 transition-colors p-1" title="Clear all history">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <HistoryEmptyState onAction={onLoadExample || (() => {})} />
            ) : (
              <div className="flex-1">
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      height={height}
                      width={width}
                      itemCount={history.length}
                      itemSize={110} 
                    >
                      {HistoryRow}
                    </List>
                  )}
                </AutoSizer>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="h-full flex flex-col">
             <div className="flex items-center justify-between mb-2 shrink-0 px-1">
               {savedProjects.length > 0 && <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{savedProjects.length} Saved Projects</span>}
            </div>
            {savedProjects.length === 0 ? (
              <ProjectsEmptyState onAction={onStartProject || (() => {})} />
            ) : (
               <div className="flex-1">
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      height={height}
                      width={width}
                      itemCount={savedProjects.length}
                      itemSize={100}
                    >
                      {ProjectRow}
                    </List>
                  )}
                </AutoSizer>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="h-full flex flex-col">
            <div className="shrink-0 mb-3 flex gap-2">
               <div className="relative group flex-1">
                  <input 
                    type="text" 
                    placeholder="Search templates..." 
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
               </div>
               <button onClick={onCreateTemplate} className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors border border-transparent hover:border-indigo-400">
                 <Plus className="w-4 h-4" />
               </button>
            </div>

            {customTemplates.length === 0 ? (
              <TemplatesEmptyState onAction={onCreateTemplate} />
            ) : flattenedTemplates.length === 0 ? (
               <div className="text-center py-8">
                  <p className="text-xs text-slate-500">No matches found</p>
               </div>
            ) : (
              <div className="flex-1">
                 <AutoSizer>
                  {({ height, width }) => (
                    <List
                      height={height}
                      width={width}
                      itemCount={flattenedTemplates.length}
                      itemSize={100} 
                    >
                      {TemplateRow}
                    </List>
                  )}
                </AutoSizer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;