import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: string | null;
  email: string | null;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  sessionExpiry: number | null;
  
  setUser: (userId: string, email: string, emailVerified: boolean, twoFactorEnabled: boolean) => void;
  setSessionExpiry: (expiry: number) => void;
  clearSession: () => void;
  isSessionValid: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      email: null,
      emailVerified: false,
      twoFactorEnabled: false,
      sessionExpiry: null,

      setUser: (userId, email, emailVerified, twoFactorEnabled) =>
        set({ userId, email, emailVerified, twoFactorEnabled }),

      setSessionExpiry: (expiry) => set({ sessionExpiry: expiry }),

      clearSession: () =>
        set({
          userId: null,
          email: null,
          emailVerified: false,
          twoFactorEnabled: false,
          sessionExpiry: null
        }),

      isSessionValid: () => {
        const { sessionExpiry } = get();
        return sessionExpiry ? Date.now() < sessionExpiry : false;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        userId: state.userId,
        email: state.email,
        emailVerified: state.emailVerified,
        twoFactorEnabled: state.twoFactorEnabled,
        sessionExpiry: state.sessionExpiry
      })
    }
  )
);
