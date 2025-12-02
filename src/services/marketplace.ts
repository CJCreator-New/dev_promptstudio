import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit, where, updateDoc, increment } from 'firebase/firestore';

// Public marketplace (CDN cached, unlimited reads)
export const getMarketplacePrompts = async (limitCount = 50) => {
  const q = query(
    collection(db, 'public_prompts'),
    orderBy('likes', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Publish to marketplace (verified users only)
export const publishToMarketplace = async (userId: string, prompt: {
  title: string;
  description: string;
  content: string;
  domain: string;
  tags: string[];
}) => {
  const promptRef = doc(collection(db, 'public_prompts'));
  await setDoc(promptRef, {
    ...prompt,
    authorId: userId,
    likes: 0,
    views: 0,
    createdAt: new Date(),
    isPublic: true
  });
  return promptRef.id;
};

// Like prompt (cached locally)
export const likePrompt = async (promptId: string) => {
  await updateDoc(doc(db, 'public_prompts', promptId), {
    likes: increment(1)
  });
};

// Search marketplace (client-side filter for free tier)
export const searchMarketplace = async (searchTerm: string, domain?: string) => {
  let q = query(collection(db, 'public_prompts'), limit(100));
  
  if (domain) {
    q = query(q, where('domain', '==', domain));
  }
  
  const snapshot = await getDocs(q);
  const prompts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Client-side search (free)
  return prompts.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tags?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};
