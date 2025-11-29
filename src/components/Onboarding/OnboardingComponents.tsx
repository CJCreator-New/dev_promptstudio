import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, Trophy, Rocket } from 'lucide-react';

// --- Welcome Modal ---
interface WelcomeModalProps {
  isOpen: boolean;
  onStartTour: () => void;
  onSkip: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onStartTour, onSkip }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return '';
  };

  const handleStart = () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    localStorage.setItem('userEmail', email);
    onStartTour();
  };

  const handleSkipWithEmail = () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    localStorage.setItem('userEmail', email);
    onSkip();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Header Graphic */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white relative z-10">Welcome to DevPrompt Studio</h2>
            <p className="text-indigo-100 mt-2 text-sm relative z-10">Turn rough ideas into architectural specs.</p>
          </div>

          <div className="p-8">
            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold border border-slate-700">1</div>
                <div>
                  <h4 className="text-slate-200 font-semibold text-sm">Configure</h4>
                  <p className="text-slate-400 text-xs mt-1">Select your target AI tool (Bolt, Cursor, etc.) and domain.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold border border-slate-700">2</div>
                <div>
                  <h4 className="text-slate-200 font-semibold text-sm">Prompt</h4>
                  <p className="text-slate-400 text-xs mt-1">Describe your idea roughly. We handle the structure.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold border border-slate-700">3</div>
                <div>
                  <h4 className="text-slate-200 font-semibold text-sm">Enhance</h4>
                  <p className="text-slate-400 text-xs mt-1">Get a polished, optimized specification in seconds.</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="onboarding-email" className="block text-xs font-medium text-slate-400 uppercase mb-2">
                Your Email <span className="text-red-400">*</span>
              </label>
              <input
                id="onboarding-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={`w-full bg-slate-950 border rounded-lg p-3 text-slate-200 text-sm focus:ring-2 outline-none placeholder-slate-600 ${
                  emailError ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-indigo-500'
                }`}
                placeholder="your.email@example.com"
                autoFocus
              />
              {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleStart}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50"
              >
                Take a quick tour
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleSkipWithEmail}
                className="w-full text-slate-500 hover:text-slate-300 text-xs font-medium py-2"
              >
                Skip intro and start building
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Completion Modal ---
interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center relative overflow-hidden"
        >
          {/* Confetti-like background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] left-[20%] w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl"></div>
             <div className="absolute bottom-[-10%] right-[10%] w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>

          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>

          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-900/20 relative z-10">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2 relative z-10">You're all set!</h3>
          <p className="text-slate-400 text-sm mb-6 relative z-10">
            You've unlocked the <strong>Prompt Architect</strong> badge. Go ahead and create your first specification.
          </p>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            <Rocket className="w-4 h-4 text-indigo-400" />
            Create First Prompt
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};