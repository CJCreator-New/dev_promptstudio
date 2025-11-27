/**
 * Date utility functions
 */

/**
 * Format timestamp to relative time (e.g., "2 minutes ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

/**
 * Format timestamp to readable date string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

/**
 * Check if timestamp is today
 */
export const isToday = (timestamp: number): boolean => {
  const today = new Date();
  const date = new Date(timestamp);
  return date.toDateString() === today.toDateString();
};