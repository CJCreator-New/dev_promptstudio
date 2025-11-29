import React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginModalProps {
  onLogin: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    onLogin(email);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
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
          <p className="text-indigo-100 mt-2 text-sm relative z-10">Enter your email to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label htmlFor="login-email" className="block text-xs font-medium text-slate-400 uppercase mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`w-full bg-slate-950 border rounded-lg pl-11 pr-4 py-3 text-slate-200 text-sm focus:ring-2 outline-none placeholder-slate-600 ${
                  error ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-indigo-500'
                }`}
                placeholder="your.email@example.com"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-xs text-slate-500 text-center mt-4">
            Your session is stored locally on your device
          </p>
        </form>
      </motion.div>
    </div>
  );
};
