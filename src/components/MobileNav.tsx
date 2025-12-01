import React, { useState } from 'react';

interface Props {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const MobileNav: React.FC<Props> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'prompts', label: 'Prompts', icon: '📝' },
    { id: 'test', label: 'Test', icon: '🧪' },
    { id: 'chains', label: 'Chains', icon: '🔗' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'marketplace', label: 'Market', icon: '🏪' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">DevPrompt</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 pt-16" onClick={() => setIsOpen(false)}>
          <div className="bg-white w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                currentPage === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
