import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';

// Save prompt to cloud
export const savePromptToCloud = async (userId: string, prompt: {
  id: string;
  original: string;
  enhanced: string;
  domain: string;
  mode: string;
}) => {
  await setDoc(doc(db, 'prompts', prompt.id), {
    userId,
    ...prompt,
    createdAt: serverTimestamp(),
    isFavorite: false
  });
};

// Get user's prompts
export const getUserPrompts = async (userId: string, limitCount = 50) => {
  const q = query(
    collection(db, 'prompts'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Toggle favorite
export const toggleFavorite = async (promptId: string, isFavorite: boolean) => {
  await updateDoc(doc(db, 'prompts', promptId), {
    isFavorite: !isFavorite
  });
};

// Get favorites
export const getFavorites = async (userId: string) => {
  const q = query(
    collection(db, 'prompts'),
    where('userId', '==', userId),
    where('isFavorite', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Create share link
export const createShareLink = async (userId: string, prompt: {
  original: string;
  enhanced: string;
  domain: string;
}) => {
  const shareId = crypto.randomUUID().slice(0, 8);
  await setDoc(doc(db, 'shares', shareId), {
    userId,
    ...prompt,
    views: 0,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
  return shareId;
};

// Get shared prompt
export const getSharedPrompt = async (shareId: string) => {
  const docRef = doc(db, 'shares', shareId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    // Increment view count
    await updateDoc(docRef, { views: (docSnap.data().views || 0) + 1 });
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

// Delete prompt
export const deletePrompt = async (promptId: string) => {
  await deleteDoc(doc(db, 'prompts', promptId));
};