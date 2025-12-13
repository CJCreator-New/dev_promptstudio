import React from 'react';
import { Sparkles, Zap, Target, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onSkip }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to DevPrompt Studio
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your AI-powered prompt engineering workspace. Let's get you started in just 2 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <Zap className="w-8 h-8 mb-4" />
            <h3 className="font-semibold mb-2">Enhance Prompts</h3>
            <p className="text-sm text-white/80">
              Transform rough ideas into production-ready prompts with AI assistance
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <Target className="w-8 h-8 mb-4" />
            <h3 className="font-semibold mb-2">Version Control</h3>
            <p className="text-sm text-white/80">
              Track changes, compare versions, and maintain prompt history
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <Sparkles className="w-8 h-8 mb-4" />
            <h3 className="font-semibold mb-2">Team Collaboration</h3>
            <p className="text-sm text-white/80">
              Share templates, sync across devices, and work together
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onSkip}
            className="px-6 py-3 text-white/90 hover:text-white transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-white/90 transition-colors font-semibold text-lg shadow-xl"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
