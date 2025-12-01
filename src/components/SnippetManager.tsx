import React, { useState } from 'react';

interface Snippet {
  trigger: string;
  content: string;
  description: string;
}

const defaultSnippets: Snippet[] = [
  { trigger: '/expert', content: 'You are an expert in {{field}}. ', description: 'Expert role definition' },
  { trigger: '/analyze', content: 'Analyze the following {{item}} and provide insights:\n\n', description: 'Analysis prompt' },
  { trigger: '/format', content: 'Format the output as {{format}} with the following structure:\n\n', description: 'Output format' },
  { trigger: '/steps', content: 'Provide a step-by-step guide to {{task}}:\n\n1. ', description: 'Step-by-step guide' },
  { trigger: '/compare', content: 'Compare {{item1}} and {{item2}} focusing on:\n- ', description: 'Comparison prompt' },
  { trigger: '/summarize', content: 'Summarize the following in {{length}}:\n\n', description: 'Summarization' },
  { trigger: '/code', content: 'Write {{language}} code to {{task}}. Include comments and error handling.', description: 'Code generation' },
  { trigger: '/review', content: 'Review the following {{type}} and provide feedback on:\n- Quality\n- Improvements\n- Best practices\n\n', description: 'Review prompt' },
];

interface Props {
  onInsert: (content: string) => void;
}

export const SnippetManager: React.FC<Props> = ({ onInsert }) => {
  const [search, setSearch] = useState('');
  const [snippets] = useState<Snippet[]>(defaultSnippets);

  const filtered = snippets.filter((s) =>
    s.trigger.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-white border rounded-lg">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Prompt Snippets</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search snippets... (type / to trigger)"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map((snippet) => (
          <div
            key={snippet.trigger}
            onClick={() => onInsert(snippet.content)}
            className="p-3 border rounded hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <code className="text-sm font-mono text-blue-600">{snippet.trigger}</code>
              <span className="text-xs text-gray-500">{snippet.description}</span>
            </div>
            <div className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded">
              {snippet.content}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 py-8">No snippets found</div>
      )}

      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        💡 Tip: Type <code className="px-1 bg-gray-100 rounded">/</code> in the editor to trigger snippets
      </div>
    </div>
  );
};
