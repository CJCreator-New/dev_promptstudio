import React, { useState, useEffect } from 'react';
import { SuggestionEngine, Suggestion } from '../services/suggestionEngine';

interface Props {
  text: string;
  onApplySuggestion: (suggestion: string) => void;
}

const engine = new SuggestionEngine();

export const SmartSuggestions: React.FC<Props> = ({ text, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (text.length > 10) {
      const newSuggestions = engine.getSuggestions(text);
      setSuggestions(newSuggestions);
      setShowPanel(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowPanel(false);
    }
  }, [text]);

  useEffect(() => {
    if (text.length > 50) {
      engine.addToHistory(text);
    }
  }, [text]);

  if (!showPanel || suggestions.length === 0) return null;

  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'similar_prompt': return '🔄';
      case 'variable': return '📌';
      case 'pattern': return '⚠️';
      case 'completion': return '✨';
    }
  };

  const getColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'similar_prompt': return 'bg-blue-50 border-blue-200';
      case 'variable': return 'bg-purple-50 border-purple-200';
      case 'pattern': return 'bg-yellow-50 border-yellow-200';
      case 'completion': return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="absolute right-4 top-4 w-80 bg-white border rounded-lg shadow-lg p-4 z-10 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Smart Suggestions</h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-3 rounded border cursor-pointer hover:shadow-md transition-shadow ${getColor(suggestion.type)}`}
            onClick={() => {
              onApplySuggestion(suggestion.content);
              setShowPanel(false);
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{getIcon(suggestion.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-1">{suggestion.content}</div>
                {suggestion.reason && (
                  <div className="text-xs text-gray-600">{suggestion.reason}</div>
                )}
                <div className="mt-1">
                  <div className="h-1 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${suggestion.score * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t text-xs text-gray-500 text-center">
        Click any suggestion to apply
      </div>
    </div>
  );
};
