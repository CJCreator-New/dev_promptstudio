interface UserSession {
  email: string;
  loginTime: number;
}

const SESSION_KEY = 'devprompt_user_session';

export const saveUserSession = (email: string): void => {
  const session: UserSession = {
    email,
    loginTime: Date.now()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem('userEmail', email);
};

export const getUserSession = (): UserSession | null => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData);
  } catch {
    return null;
  }
};

export const clearUserSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const isUserLoggedIn = (): boolean => {
  return getUserSession() !== null;
};
