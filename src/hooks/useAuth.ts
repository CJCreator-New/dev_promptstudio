import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
  const { userId, email, emailVerified, twoFactorEnabled, setUser, clearSession, isSessionValid } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid, user.email!, user.emailVerified, false);
      } else {
        clearSession();
      }
    });

    return () => unsubscribe();
  }, [setUser, clearSession]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSessionValid()) {
        clearSession();
        auth.signOut();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isSessionValid, clearSession]);

  return {
    userId,
    email,
    emailVerified,
    twoFactorEnabled,
    isAuthenticated: !!userId && isSessionValid(),
    logout: () => {
      clearSession();
      auth.signOut();
    }
  };
};
