import React from 'react';
import { Sparkles, Zap, Key } from 'lucide-react';
import { Button } from './ui/Button';
import { AnimatedContainer } from './ui/AnimatedContainer';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <AnimatedContainer animation="fade" className="max-w-2xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              DevPrompt<span className="text-blue-400">Studio</span>
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Transform your ideas into professional prompts with AI assistance
          </p>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8 max-w-md mx-auto">
            <p className="text-sm text-blue-200">
              <strong>Note:</strong> You'll need your own API key (Gemini, OpenAI, or Claude) to use this app.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Your API Key</h3>
            <p className="text-sm text-slate-400">
              Use your own API key - you control the costs
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">AI Enhanced</h3>
            <p className="text-sm text-slate-400">
              Professional prompt engineering with AI
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Key className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Unlimited</h3>
            <p className="text-sm text-slate-400">
              No usage limits - enhance as many prompts as you need
            </p>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={onGetStarted} className="px-8">
          Start Enhancing Prompts
        </Button>
        
        <p className="text-sm text-slate-400 mt-4">
          No signup required • Start immediately
        </p>
      </AnimatedContainer>
    </div>
  );
};