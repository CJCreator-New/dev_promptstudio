import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface LoginAttempt {
  count: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

export const checkAccountLockout = (email: string): { locked: boolean; remainingTime: number; attempts: number } => {
  const attempt = loginAttempts.get(email);
  if (!attempt) return { locked: false, remainingTime: 0, attempts: 0 };

  if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
    return {
      locked: true,
      remainingTime: Math.ceil((attempt.lockedUntil - Date.now()) / 1000),
      attempts: attempt.count
    };
  }

  if (attempt.lockedUntil && Date.now() >= attempt.lockedUntil) {
    loginAttempts.delete(email);
  }

  return { locked: false, remainingTime: 0, attempts: attempt.count };
};

const recordFailedAttempt = (email: string) => {
  const attempt = loginAttempts.get(email) || { count: 0 };
  attempt.count++;

  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCKOUT_DURATION;
  }

  loginAttempts.set(email, attempt);
};

const clearLoginAttempts = (email: string) => {
  loginAttempts.delete(email);
};

export const registerWithEmail = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    name,
    createdAt: serverTimestamp(),
    emailVerified: false,
    twoFactorEnabled: false
  });

  await sendEmailVerification(user);
  return user;
};

export const loginWithEmail = async (email: string, password: string, remember: boolean) => {
  const lockout = checkAccountLockout(email);
  if (lockout.locked) {
    throw new Error(`Account locked. Try again in ${Math.ceil(lockout.remainingTime / 60)} minutes.`);
  }

  try {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    clearLoginAttempts(email);
    
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    });

    return userCredential.user;
  } catch (error: any) {
    recordFailedAttempt(email);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: user.displayName,
      createdAt: serverTimestamp(),
      emailVerified: true,
      provider: 'google'
    });
  }

  return user;
};

export const loginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: user.displayName,
      createdAt: serverTimestamp(),
      emailVerified: true,
      provider: 'github'
    });
  }

  return user;
};

export const sendPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const resendVerificationEmail = async (user: User) => {
  await sendEmailVerification(user);
};

export const enable2FA = async (userId: string) => {
  const secret = generateTOTPSecret();
  const qrCode = await generateQRCode(userId, secret);

  await updateDoc(doc(db, 'users', userId), {
    twoFactorSecret: secret,
    twoFactorEnabled: false
  });

  return { secret, qrCode };
};

export const verify2FA = async (userId: string, code: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const secret = userDoc.data()?.twoFactorSecret;

  if (!secret || !verifyTOTP(secret, code)) {
    throw new Error('Invalid verification code');
  }

  await updateDoc(doc(db, 'users', userId), {
    twoFactorEnabled: true
  });
};

const generateTOTPSecret = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const generateQRCode = async (userId: string, secret: string): Promise<string> => {
  const otpauth = `otpauth://totp/DevPromptStudio:${userId}?secret=${secret}&issuer=DevPromptStudio`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
};

const verifyTOTP = (secret: string, token: string): boolean => {
  // Simplified TOTP verification - in production, use a library like otplib
  return token.length === 6 && /^\d+$/.test(token);
};
