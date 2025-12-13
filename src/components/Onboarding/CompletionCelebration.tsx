import React, { useEffect, useState } from 'react';
import { PartyPopper, ArrowRight, BookOpen, Users, Zap } from 'lucide-react';

interface CompletionCelebrationProps {
  userName?: string;
  onContinue: () => void;
}

export const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({ userName, onContinue }) => {
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center py-8">
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <PartyPopper className="w-10 h-10 text-green-600" />
      </div>

      <h2 className="text-3xl font-bold mb-2">
        {userName ? `You're all set, ${userName}!` : "You're all set!"}
      </h2>
      <p className="text-muted text-lg mb-8">
        You've completed the onboarding. Here's what you can do next:
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
        <div className="p-4 rounded-lg bg-elevated border border-border">
          <Zap className="w-6 h-6 text-accent-primary mb-2" />
          <h3 className="font-semibold mb-1">Create Your First Prompt</h3>
          <p className="text-sm text-muted">Start enhancing prompts with AI assistance</p>
        </div>
        <div className="p-4 rounded-lg bg-elevated border border-border">
          <BookOpen className="w-6 h-6 text-accent-primary mb-2" />
          <h3 className="font-semibold mb-1">Explore Templates</h3>
          <p className="text-sm text-muted">Browse our library of pre-built templates</p>
        </div>
        <div className="p-4 rounded-lg bg-elevated border border-border">
          <Users className="w-6 h-6 text-accent-primary mb-2" />
          <h3 className="font-semibold mb-1">Join Community</h3>
          <p className="text-sm text-muted">Connect with other prompt engineers</p>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-white rounded-xl hover:bg-accent-primary-hover transition-colors font-semibold text-lg"
      >
        Start Creating <ArrowRight className="w-5 h-5" />
      </button>

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};
