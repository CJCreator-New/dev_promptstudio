import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import LZString from 'lz-string';

// Store version as diff (compressed)
export const saveVersion = async (promptId: string, version: {
  content: string;
  message: string;
  userId: string;
}) => {
  const versionRef = doc(collection(db, `prompts/${promptId}/versions`));
  
  // Compress content to save storage
  const compressed = LZString.compressToUTF16(version.content);
  
  await setDoc(versionRef, {
    content: compressed,
    message: version.message,
    userId: version.userId,
    createdAt: new Date(),
    size: compressed.length
  });
  
  return versionRef.id;
};

// Get version history (subcollection = 1 read for all)
export const getVersionHistory = async (promptId: string) => {
  const q = query(
    collection(db, `prompts/${promptId}/versions`),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      content: LZString.decompressFromUTF16(data.content),
      message: data.message,
      userId: data.userId,
      createdAt: data.createdAt,
      size: data.size
    };
  });
};

// Compare two versions (client-side diff)
export const compareVersions = (v1: string, v2: string) => {
  // Simple diff algorithm (runs in browser, free)
  const lines1 = v1.split('\n');
  const lines2 = v2.split('\n');
  
  const diff = [];
  const maxLen = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < maxLen; i++) {
    if (lines1[i] !== lines2[i]) {
      diff.push({
        line: i + 1,
        old: lines1[i] || '',
        new: lines2[i] || '',
        type: !lines1[i] ? 'added' : !lines2[i] ? 'removed' : 'modified'
      });
    }
  }
  
  return diff;
};
