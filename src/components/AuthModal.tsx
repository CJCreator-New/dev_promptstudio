import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { AnimatedContainer } from './ui/AnimatedContainer';
import { registerUser, loginUser, loginAnonymously } from '../services/firebaseAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = mode === 'register' 
        ? await registerUser(email, password)
        : await loginUser(email, password);
      
      onSuccess(user.uid);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setLoading(true);
    try {
      const user = await loginAnonymously();
      onSuccess(user.uid);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <AnimatedContainer animation="scale" className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {mode === 'register' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              loading={loading}
            >
              {mode === 'register' ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {mode === 'register' 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Or</span>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={handleAnonymous}
              disabled={loading}
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};