import { EnhancementOptions } from '../types';

export interface ShareableData {
  input: string;
  options: EnhancementOptions;
  enhancedPrompt: string;
  originalPrompt: string | null;
}

/**
 * Compresses and encodes the prompt state into a URL-safe Base64 string.
 * Handles Unicode characters correctly.
 */
export const generateShareLink = (data: ShareableData): string => {
  try {
    const jsonString = JSON.stringify(data);
    // UTF-8 safe encoding
    const base64 = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      }));
    
    const url = new URL(window.location.href);
    url.searchParams.set('share', base64);
    return url.toString();
  } catch (e) {
    console.error("Failed to generate share link", e);
    return window.location.href;
  }
};

/**
 * Decodes the Base64 string from the URL back into the application state.
 */
export const parseShareParam = (param: string): ShareableData | null => {
  try {
    // UTF-8 safe decoding
    const jsonString = decodeURIComponent(Array.prototype.map.call(atob(param), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse share param", e);
    return null;
  }
};