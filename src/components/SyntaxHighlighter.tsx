import React, { useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../store/editorStore';
import { useCustomizationStore } from '../store/customizationStore';

interface SyntaxHighlighterProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
}

const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'c',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'sql',
  'html', 'css', 'json', 'xml', 'yaml', 'markdown', 'shell', 'plaintext'
];

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  value,
  onChange,
  language = 'plaintext',
  readOnly = false,
  height = '400px',
  placeholder = 'Start typing...'
}) => {
  const editorRef = useRef<any>(null);
  const { syntaxHighlighting, setSyntaxHighlighting } = useEditorStore();
  const { theme } = useCustomizationStore();

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: 'selection',
      folding: true,
      lineNumbers: 'on',
      glyphMargin: false,
      contextmenu: true,
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly,
      cursorStyle: 'line',
      mouseWheelZoom: true,
      smoothScrolling: true,
      cursorBlinking: 'blink',
      cursorSmoothCaretAnimation: true,
      renderLineHighlight: 'line',
      selectionHighlight: true,
      occurrencesHighlight: true,
      codeLens: false,
      folding: true,
      foldingHighlight: true,
      unfoldOnClickAfterEndOfLine: false,
      showUnused: true,
      bracketPairColorization: { enabled: true }
    });

    // Add placeholder support
    if (placeholder && !value) {
      const placeholderDecoration = editor.deltaDecorations([], [{
        range: new monaco.Range(1, 1, 1, 1),
        options: {
          afterContentClassName: 'monaco-placeholder',
          after: {
            content: placeholder,
            inlineClassName: 'monaco-placeholder-text'
          }
        }
      }]);
    }
  }, [readOnly, placeholder, value]);

  const handleChange = useCallback((newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  }, [onChange]);

  const effectiveLanguage = syntaxHighlighting && SUPPORTED_LANGUAGES.includes(language) 
    ? language 
    : 'plaintext';

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Language:
          </label>
          <select
            value={language}
            onChange={(e) => {
              // This would be handled by parent component
              console.log('Language changed:', e.target.value);
            }}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => setSyntaxHighlighting(!syntaxHighlighting)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            syntaxHighlighting
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}
          aria-label={`${syntaxHighlighting ? 'Disable' : 'Enable'} syntax highlighting`}
        >
          {syntaxHighlighting ? '🎨 Highlighting On' : '📝 Plain Text'}
        </button>
      </div>

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <Editor
          height={height}
          language={effectiveLanguage}
          value={value}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            readOnly,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineHeight: 20,
            wordWrap: 'on',
            automaticLayout: true
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        />
      </div>

      <style jsx>{`
        .monaco-placeholder-text {
          color: #999;
          font-style: italic;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default SyntaxHighlighter;