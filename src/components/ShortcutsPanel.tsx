import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { category: 'General', items: [
    { keys: ['?'], description: 'Show keyboard shortcuts' },
    { keys: ['Ctrl', 'S'], description: 'Save prompt' },
    { keys: ['Ctrl', 'N'], description: 'New prompt' },
    { keys: ['Ctrl', 'K'], description: 'Open command palette' },
    { keys: ['Esc'], description: 'Close modal/panel' },
  ]},
  { category: 'Editor', items: [
    { keys: ['Ctrl', 'Enter'], description: 'Generate response' },
    { keys: ['Ctrl', 'Z'], description: 'Undo' },
    { keys: ['Ctrl', 'Y'], description: 'Redo' },
    { keys: ['Ctrl', '/'], description: 'Toggle comment' },
    { keys: ['Alt', 'Up/Down'], description: 'Move line up/down' },
  ]},
  { category: 'Navigation', items: [
    { keys: ['Ctrl', 'P'], description: 'Quick open prompt' },
    { keys: ['Ctrl', 'B'], description: 'Toggle sidebar' },
    { keys: ['Ctrl', '1-9'], description: 'Switch to tab' },
    { keys: ['Ctrl', 'Tab'], description: 'Next tab' },
  ]},
  { category: 'Testing', items: [
    { keys: ['Ctrl', 'T'], description: 'Run tests' },
    { keys: ['Ctrl', 'Shift', 'T'], description: 'Run all tests' },
    { keys: ['F5'], description: 'Debug prompt' },
  ]},
];

export const ShortcutsPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="font-semibold text-lg mb-3 text-blue-600">{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{item.description}</span>
                    <div className="flex gap-1">
                      {item.keys.map((key, j) => (
                        <kbd key={j} className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">?</kbd> anytime to toggle this panel
        </div>
      </div>
    </div>
  );
};
