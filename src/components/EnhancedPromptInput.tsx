import React, { useState } from 'react';
import { SyntaxHighlighter } from './SyntaxHighlighter';
import { useEditorStore } from '../store/editorStore';
import { Button } from './atomic/Button';

interface EnhancedPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnhance?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const EnhancedPromptInput: React.FC<EnhancedPromptInputProps> = ({
  value,
  onChange,
  onEnhance,
  placeholder = "Enter your prompt here...",
  disabled = false
}) => {
  const { selectedLanguage, setSelectedLanguage, syntaxHighlighting } = useEditorStore();
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mode:
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'basic' | 'advanced')}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {onEnhance && (
          <Button
            onClick={onEnhance}
            disabled={disabled || !value.trim()}
            variant="primary"
            size="sm"
          >
            ✨ Enhance
          </Button>
        )}
      </div>

      {mode === 'basic' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          aria-label="Prompt input"
        />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Language:
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="plaintext">Plain Text</option>
              <option value="markdown">Markdown</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="swift">Swift</option>
              <option value="kotlin">Kotlin</option>
              <option value="sql">SQL</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="xml">XML</option>
              <option value="shell">Shell</option>
            </select>
          </div>

          <SyntaxHighlighter
            value={value}
            onChange={onChange}
            language={selectedLanguage}
            readOnly={disabled}
            height="300px"
            placeholder={placeholder}
          />
        </div>
      )}

      {syntaxHighlighting && mode === 'advanced' && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          💡 Syntax highlighting is enabled. Use the toggle to switch to plain text mode.
        </div>
      )}
    </div>
  );
};

export default EnhancedPromptInput;