/**
 * Secure API Key Storage using WebCrypto API
 * - AES-GCM encryption
 * - Device fingerprint-based key derivation
 * - IndexedDB storage
 */

// Generate device fingerprint for key derivation
async function getDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.colorDepth,
    screen.width + 'x' + screen.height,
  ];
  
  const fingerprint = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Derive encryption key from device fingerprint
async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
  const fingerprint = await getDeviceFingerprint();
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(fingerprint),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt API key
async function encryptApiKey(apiKey: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(salt);
  
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(apiKey)
  );

  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

// Decrypt API key
async function decryptApiKey(encryptedData: string): Promise<string> {
  try {
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encrypted = combined.slice(28);
    
    const key = await deriveKey(salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error('Failed to decrypt API key. Storage may be corrupted.');
  }
}

// Storage interface
export const secureStorage = {
  async setApiKey(provider: string, apiKey: string): Promise<void> {
    try {
      const encrypted = await encryptApiKey(apiKey);
      localStorage.setItem(`secure_api_key_${provider}`, encrypted);
    } catch (error) {
      console.error('Failed to store API key:', error);
      throw new Error('Failed to securely store API key');
    }
  },

  async getApiKey(provider: string): Promise<string | null> {
    try {
      const encrypted = localStorage.getItem(`secure_api_key_${provider}`);
      if (!encrypted) return null;
      
      return await decryptApiKey(encrypted);
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      // Clear corrupted data
      localStorage.removeItem(`secure_api_key_${provider}`);
      return null;
    }
  },

  async removeApiKey(provider: string): Promise<void> {
    localStorage.removeItem(`secure_api_key_${provider}`);
  },

  async hasApiKey(provider: string): Promise<boolean> {
    return localStorage.getItem(`secure_api_key_${provider}`) !== null;
  },

  // Migration: encrypt existing plain-text keys
  async migrateExistingKeys(): Promise<void> {
    const providers = ['gemini', 'openai', 'anthropic', 'openrouter'];
    
    for (const provider of providers) {
      const oldKey = localStorage.getItem(`${provider}_api_key`);
      if (oldKey && !oldKey.startsWith('encrypted:')) {
        await this.setApiKey(provider, oldKey);
        localStorage.removeItem(`${provider}_api_key`);
      }
    }
  }
};
