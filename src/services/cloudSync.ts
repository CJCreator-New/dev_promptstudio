import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc, updateDoc, serverTimestamp, writeBatch, startAfter } from 'firebase/firestore';
import { cache } from './cacheService';

// Save prompt to cloud (favorites only)
export const savePromptToCloud = async (userId: string, prompt: {
  id: string;
  original: string;
  enhanced: string;
  domain: string;
  mode: string;
  isFavorite?: boolean;
}) => {
  // Only sync if marked as favorite
  if (!prompt.isFavorite) return;
  
  await setDoc(doc(db, 'prompts', prompt.id), {
    userId,
    ...prompt,
    createdAt: serverTimestamp(),
    isFavorite: true
  });
};

// Get user's prompts with caching and pagination
export const getUserPrompts = async (userId: string, limitCount = 20, lastDoc?: any) => {
  const cacheKey = `prompts_${userId}_${lastDoc?.id || 'first'}`;
  
  return cache.get(cacheKey, async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let q = query(
      collection(db, 'prompts'),
      where('userId', '==', userId),
      where('createdAt', '>=', thirtyDaysAgo),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const snapshot = await getDocs(q);
    return {
      prompts: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
  });
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

// Batch sync favorites (500 operations = 1 write)
export const syncFavoritesToCloud = async (userId: string, favorites: any[]) => {
  const recentFavorites = favorites.filter(p => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return p.timestamp > thirtyDaysAgo;
  }).slice(0, 100);
  
  const batch = writeBatch(db);
  recentFavorites.forEach(prompt => {
    const ref = doc(db, 'prompts', prompt.id);
    batch.set(ref, {
      userId,
      ...prompt,
      isFavorite: true,
      createdAt: serverTimestamp()
    });
  });
  
  await batch.commit();
  cache.invalidate(`prompts_${userId}_first`);
};

// Get last sync time
export const getLastSyncTime = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.data()?.lastSyncTime || null;
};

// Update last sync time
export const updateLastSyncTime = async (userId: string) => {
  await updateDoc(doc(db, 'users', userId), {
    lastSyncTime: serverTimestamp()
  });
};