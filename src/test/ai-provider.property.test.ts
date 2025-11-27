import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { useAIProviderStore } from '../store/aiProviderStore';
import { resetStores } from './helpers/store-reset';

describe('AI Provider Properties', () => {
  beforeEach(() => {
    resetStores();
  });
  
  afterEach(() => {
    resetStores();
  });

  // Property 49: Secure Credential Storage
  it('Property 49: encrypts and decrypts API keys securely', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 10, maxLength: 100 }),
      (apiKey) => {
        const store = useAIProviderStore.getState();
        
        // Encrypt the API key
        const encrypted = store.encryptApiKey(apiKey);
        
        // Encrypted key should be different from original
        expect(encrypted).not.toBe(apiKey);
        expect(encrypted.length).toBeGreaterThan(0);
        
        // Decrypt should return original
        const decrypted = store.decryptApiKey(encrypted);
        expect(decrypted).toBe(apiKey);
      }
    ));
  });

  // Property 50: Provider Selection
  it('Property 50: maintains active provider selection correctly', async () => {
    fc.assert(fc.asyncProperty(
      fc.array(fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        type: fc.constantFrom('openai', 'anthropic', 'google', 'custom'),
        apiKey: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10),
        model: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        enabled: fc.boolean(),
        isDefault: fc.boolean()
      }), { minLength: 1, maxLength: 3 }),
      async (providers) => {
        resetStores();
        const store = useAIProviderStore.getState();
        
        // Add all providers sequentially
        for (const provider of providers) {
          await store.addProvider(provider);
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const addedProviders = useAIProviderStore.getState().providers;
        expect(addedProviders.length).toBe(providers.length);
        
        // Test setting active provider
        if (addedProviders.length > 0) {
          const providerId = addedProviders[0].id;
          store.setActiveProvider(providerId);
          
          expect(useAIProviderStore.getState().activeProvider).toBe(providerId);
          
          const activeProvider = store.getActiveProvider();
          expect(activeProvider?.id).toBe(providerId);
        }
      }
    ), { numRuns: 5 });
  });

  // Property 51: API Key Validation
  it('Property 51: validates API keys according to provider type', async () => {
    fc.assert(fc.asyncProperty(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        type: fc.constantFrom('openai', 'anthropic', 'google', 'custom'),
        model: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        enabled: fc.boolean(),
        isDefault: fc.boolean()
      }),
      fc.oneof(
        fc.constant('sk-valid-openai-key'),
        fc.constant('sk-ant-valid-anthropic-key'),
        fc.constant('valid-google-key-with-sufficient-length'),
        fc.constant('invalid-key')
      ),
      async (providerData, apiKey) => {
        resetStores();
        const store = useAIProviderStore.getState();
        
        await store.addProvider({
          ...providerData,
          apiKey
        });
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const addedProvider = useAIProviderStore.getState().providers[0];
        expect(addedProvider).toBeDefined();
        
        // Validation should match expected pattern
        const expectedValid = (
          (providerData.type === 'openai' && apiKey.startsWith('sk-')) ||
          (providerData.type === 'anthropic' && apiKey.startsWith('sk-ant-')) ||
          (providerData.type === 'google' && apiKey.length > 20) ||
          (providerData.type === 'custom' && apiKey.length > 0)
        );
        
        expect(addedProvider.validationStatus).toBe(expectedValid ? 'valid' : 'invalid');
      }
    ), { numRuns: 5 });
  });

  // Property 52: Provider Fallback
  it('Property 52: handles provider fallback when active provider is removed', async () => {
    fc.assert(fc.asyncProperty(
      fc.array(fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        type: fc.constantFrom('openai', 'anthropic', 'google', 'custom'),
        apiKey: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10),
        model: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        enabled: fc.boolean(),
        isDefault: fc.boolean()
      }), { minLength: 2, maxLength: 3 }),
      async (providers) => {
        resetStores();
        const store = useAIProviderStore.getState();
        
        // Add all providers
        for (const provider of providers) {
          await store.addProvider(provider);
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const addedProviders = useAIProviderStore.getState().providers;
        const firstProviderId = addedProviders[0].id;
        
        // Set first provider as active
        store.setActiveProvider(firstProviderId);
        expect(useAIProviderStore.getState().activeProvider).toBe(firstProviderId);
        
        // Remove the active provider
        await store.removeProvider(firstProviderId);
        
        const remainingProviders = useAIProviderStore.getState().providers;
        expect(remainingProviders.length).toBe(providers.length - 1);
        
        // Active provider should fallback to first remaining provider
        const newActiveProvider = useAIProviderStore.getState().activeProvider;
        if (remainingProviders.length > 0) {
          expect(newActiveProvider).toBe(remainingProviders[0].id);
        } else {
          expect(newActiveProvider).toBeNull();
        }
      }
    ), { numRuns: 5 });
  });

  // Property 53: Provider Removal Cleanup
  it('Property 53: properly cleans up when removing providers', async () => {
    fc.assert(fc.asyncProperty(
      fc.array(fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        type: fc.constantFrom('openai', 'anthropic', 'google', 'custom'),
        apiKey: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10),
        model: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        enabled: fc.boolean(),
        isDefault: fc.boolean()
      }), { minLength: 1, maxLength: 3 }),
      async (providers) => {
        resetStores();
        const store = useAIProviderStore.getState();
        
        // Add all providers
        for (const provider of providers) {
          await store.addProvider(provider);
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const addedProviders = useAIProviderStore.getState().providers;
        
        // Remove each provider one by one
        for (const provider of addedProviders) {
          await store.removeProvider(provider.id);
        }
        
        const finalState = useAIProviderStore.getState();
        
        // All providers should be removed
        expect(finalState.providers.length).toBe(0);
        expect(finalState.activeProvider).toBeNull();
      }
    ), { numRuns: 5 });
  });

  it('Property: Default provider management', async () => {
    fc.assert(fc.asyncProperty(
      fc.array(fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        type: fc.constantFrom('openai', 'anthropic', 'google'),
        apiKey: fc.oneof(
          fc.constant('sk-valid-openai-key'),
          fc.constant('sk-ant-valid-anthropic-key'),
          fc.constant('valid-google-key-with-sufficient-length')
        ),
        enabled: fc.constant(true),
        isDefault: fc.boolean()
      }), { minLength: 1, maxLength: 3 }),
      async (providers) => {
        resetStores();
        const store = useAIProviderStore.getState();
        
        // Add providers
        for (const provider of providers) {
          let model = '';
          switch (provider.type) {
            case 'openai':
              model = 'gpt-4';
              break;
            case 'anthropic':
              model = 'claude-3-opus';
              break;
            case 'google':
              model = 'gemini-pro';
              break;
          }
          
          await store.addProvider({
            ...provider,
            model
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const addedProviders = useAIProviderStore.getState().providers;
        
        // Verify default provider logic
        const defaultProviders = addedProviders.filter(p => p.isDefault);
        
        if (providers.some(p => p.isDefault)) {
          // Should have at least one default if explicitly set
          expect(defaultProviders.length).toBeGreaterThanOrEqual(1);
        } else if (addedProviders.length > 0) {
          // First provider should be default if none explicitly set
          expect(addedProviders[0].isDefault).toBe(true);
        }
        
        // Test setting new default
        if (addedProviders.length > 1) {
          const secondProvider = addedProviders[1];
          store.setDefaultProvider(secondProvider.id);
          
          const updatedProviders = useAIProviderStore.getState().providers;
          const newDefaultProviders = updatedProviders.filter(p => p.isDefault);
          
          expect(newDefaultProviders.length).toBe(1);
          expect(newDefaultProviders[0].id).toBe(secondProvider.id);
        }
      }
    ), { numRuns: 5 });
  });
});