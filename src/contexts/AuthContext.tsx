import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthChange, logoutUser } from '../services/firebaseAuth';

interface AuthContextValue {
  userId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  skipAuth?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, skipAuth = false }) => {
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(!skipAuth);

  useEffect(() => {
    if (skipAuth) {
      setUserId('test-user');
      setIsLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      const unsubscribe = onAuthChange((user) => {
        setUserId(user?.uid || '');
        setIsLoading(false);
      });
      return () => unsubscribe();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [skipAuth]);

  const logout = async () => {
    await logoutUser();
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ 
      userId, 
      isAuthenticated: !!userId,
      isLoading,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
