import React, { useState } from 'react';

const MinimalApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setOutput('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput(`Enhanced: ${input}`);
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">DevPrompt Studio - Minimal</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Input</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 bg-slate-800 border border-slate-600 rounded-lg p-4 text-white resize-none"
              placeholder="Enter your prompt here..."
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 rounded-lg font-medium"
            >
              {loading ? 'Processing...' : 'Enhance'}
            </button>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Output</h2>
            <div className="w-full h-64 bg-slate-800 border border-slate-600 rounded-lg p-4 text-white overflow-auto">
              {loading ? (
                <div className="animate-pulse">Generating...</div>
              ) : (
                output || 'Output will appear here...'
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-400">
          <p>If you see this, the basic React app is working.</p>
          <p>The issue is likely in the complex App component or its dependencies.</p>
        </div>
      </div>
    </div>
  );
};

export default MinimalApp;