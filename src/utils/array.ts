/**
 * Array utility functions
 */

/**
 * Remove duplicates from array
 */
export const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

/**
 * Chunk array into smaller arrays of specified size
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Get last N items from array
 */
export const takeLast = <T>(arr: T[], count: number): T[] => {
  return arr.slice(-count);
};

/**
 * Shuffle array randomly
 */
export const shuffle = <T>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};