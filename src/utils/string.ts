/**
 * String utility functions
 */

/**
 * Truncate string to specified length with ellipsis
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to kebab-case
 */
export const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Remove HTML tags from string
 */
export const stripHtml = (str: string): string => {
  return str.replace(/<[^>]*>/g, '');
};