import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
      signupSource: new URLSearchParams(window.location.search).get('utm_source') || 'organic',
      totalEnhancements: 0,
      hasAddedApiKey: false
    });
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('Firebase Authentication not enabled. Enable it in Firebase Console.');
    }
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('Firebase Authentication not enabled. Enable it in Firebase Console.');
    }
    throw error;
  }
};

export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      email: null,
      isAnonymous: true,
      createdAt: serverTimestamp(),
      totalEnhancements: 0
    }, { merge: true });
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/configuration-not-found') {
      console.warn('Firebase not configured, running in local-only mode');
      return null;
    }
    throw error;
  }
};

export const initAnonymousAuth = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) return currentUser;
    return await loginAnonymously();
  } catch (error: any) {
    if (error.code === 'auth/admin-restricted-operation') {
      console.warn('Firebase Anonymous auth not enabled. Running in local-only mode.');
      return null;
    }
    console.warn('Anonymous auth failed:', error);
    return null;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const logoutUser = async () => {
  await auth.signOut();
};