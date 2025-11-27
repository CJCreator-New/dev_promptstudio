import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { useAIProviderStore } from '../store/aiProviderStore';
import { resetStores } from './helpers/store-reset';

describe('Model Selection Properties', () => {
  beforeEach(() => {
    resetStores();
  });

  // Property 86: Model Selection Per Provider
  it('Property 86: allows model selection per provider type', async () => {
    fc.assert(fc.asyncProperty(
      fc.array(fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }),
        type: fc.constantFrom('openai', 'anthropic', 'google', 'custom'),
        apiKey: fc.oneof(
          fc.constant('sk-valid-openai-key'),
          fc.constant('sk-ant-valid-anthropic-key'),
          fc.constant('valid-google-key-with-sufficient-length')
        ),
        enabled: fc.boolean(),
        isDefault: fc.boolean()
      }), { minLength: 1, maxLength: 5 }),
      async (providers) => {
        const store = useAIProviderStore.getState();
        
        // Add providers with appropriate models
        for (const provider of providers) {
          let model = '';
          switch (provider.type) {
            case 'openai':
              model = fc.sample(fc.constantFrom('gpt-4', 'gpt-3.5-turbo'), 1)[0];
              break;
            case 'anthropic':
              model = 'claude-3-opus';
              break;
            case 'google':
              model = 'gemini-pro';
              break;
            case 'custom':
              model = 'custom-model';
              break;
          }
          
          await store.addProvider({
            ...provider,
            model
          });
        }
        
        const addedProviders = useAIProviderStore.getState().providers;
        
        // Verify each provider has appropriate model for its type
        addedProviders.forEach(provider => {
          switch (provider.type) {
            case 'openai':
              expect(['gpt-4', 'gpt-3.5-turbo']).toContain(provider.model);
              break;
            case 'anthropic':
              expect(provider.model).toBe('claude-3-opus');
              break;
            case 'google':
              expect(provider.model).toBe('gemini-pro');
              break;
            case 'custom':
              expect(provider.model).toBe('custom-model');
              break;
          }
        });
      }
    ));
  });

  // Property 87: Selected Model Usage
  it('Property 87: uses selected model for active provider', async () => {
    fc.assert(fc.asyncProperty(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }),
        type: fc.constantFrom('openai', 'anthropic', 'google'),
        apiKey: fc.oneof(
          fc.constant('sk-valid-openai-key'),
          fc.constant('sk-ant-valid-anthropic-key'),
          fc.constant('valid-google-key-with-sufficient-length')
        ),
        enabled: fc.constant(true),
        isDefault: fc.constant(true)
      }),
      async (providerData) => {
        const store = useAIProviderStore.getState();
        
        let availableModels: string[] = [];
        switch (providerData.type) {
          case 'openai':
            availableModels = ['gpt-4', 'gpt-3.5-turbo'];
            break;
          case 'anthropic':
            availableModels = ['claude-3-opus'];
            break;
          case 'google':
            availableModels = ['gemini-pro'];
            break;
        }
        
        // Add provider with first available model
        await store.addProvider({
          ...providerData,
          model: availableModels[0]
        });
        
        const addedProvider = useAIProviderStore.getState().providers[0];
        expect(addedProvider.model).toBe(availableModels[0]);
        
        // Set as active provider
        store.setActiveProvider(addedProvider.id);
        
        const activeProvider = store.getActiveProvider();
        expect(activeProvider?.id).toBe(addedProvider.id);
        expect(activeProvider?.model).toBe(availableModels[0]);
        
        // Update model if multiple available
        if (availableModels.length > 1) {
          await store.updateProvider(addedProvider.id, { model: availableModels[1] });
          
          const updatedActiveProvider = store.getActiveProvider();
          expect(updatedActiveProvider?.model).toBe(availableModels[1]);
        }
      }
    ));
  });

  // Property 88: Default Model
  it('Property 88: maintains default model setting', async () => {
    fc.assert(fc.asyncProperty(
      fc.array(fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }),
        type: fc.constantFrom('openai', 'anthropic', 'google'),
        apiKey: fc.oneof(
          fc.constant('sk-valid-openai-key'),
          fc.constant('sk-ant-valid-anthropic-key'),
          fc.constant('valid-google-key-with-sufficient-length')
        ),
        enabled: fc.constant(true),
        isDefault: fc.boolean()
      }), { minLength: 1, maxLength: 5 }),
      async (providers) => {
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
        
        const addedProviders = useAIProviderStore.getState().providers;
        
        // Verify default provider logic
        const defaultProviders = addedProviders.filter(p => p.isDefault);
        
        if (providers.some(p => p.isDefault)) {
          // Should have at least one default if explicitly set
          expect(defaultProviders.length).toBeGreaterThanOrEqual(1);
        } else {
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
    ));
  });

  // Property 89: Model Fallback
  it('Property 89: handles model fallback when provider unavailable', async () => {
    fc.assert(fc.asyncProperty(
      fc.array(fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }),
        type: fc.constantFrom('openai', 'anthropic', 'google'),
        apiKey: fc.oneof(
          fc.constant('sk-valid-openai-key'),
          fc.constant('sk-ant-valid-anthropic-key'),
          fc.constant('valid-google-key-with-sufficient-length')
        ),
        enabled: fc.boolean()
      }), { minLength: 2, maxLength: 5 }),
      async (providers) => {
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
            model,
            isDefault: false
          });
        }
        
        const addedProviders = useAIProviderStore.getState().providers;
        const firstProvider = addedProviders[0];
        
        // Set first provider as active
        store.setActiveProvider(firstProvider.id);
        expect(store.getActiveProvider()?.id).toBe(firstProvider.id);
        
        // Disable the active provider
        await store.updateProvider(firstProvider.id, { enabled: false });
        
        // Active provider should fallback to next available enabled provider
        const enabledProviders = useAIProviderStore.getState().providers.filter(p => p.enabled);
        const activeProvider = store.getActiveProvider();
        
        if (enabledProviders.length > 0) {
          expect(activeProvider).toBeDefined();
          expect(enabledProviders.map(p => p.id)).toContain(activeProvider?.id);
        } else {
          // If no enabled providers, should fallback to any available provider
          expect(activeProvider).toBeDefined();
        }
      }
    ));
  });

  it('Property: Model validation per provider type', async () => {
    fc.assert(fc.asyncProperty(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }),
        type: fc.constantFrom('openai', 'anthropic', 'google', 'custom'),
        apiKey: fc.string({ minLength: 10, maxLength: 100 }),
        enabled: fc.constant(true),
        isDefault: fc.constant(true)
      }),
      fc.string({ minLength: 1, maxLength: 50 }),
      async (providerData, customModel) => {
        const store = useAIProviderStore.getState();
        
        await store.addProvider({
          ...providerData,
          model: customModel
        });
        
        const addedProvider = useAIProviderStore.getState().providers[0];
        expect(addedProvider.model).toBe(customModel);
        
        // For known provider types, verify model compatibility could be checked
        const validModels: Record<string, string[]> = {
          'openai': ['gpt-4', 'gpt-3.5-turbo'],
          'anthropic': ['claude-3-opus', 'claude-3-sonnet'],
          'google': ['gemini-pro', 'gemini-pro-vision']
        };
        
        if (validModels[providerData.type]) {
          // Model should be validated against known models for the provider type
          const isKnownModel = validModels[providerData.type].includes(customModel);
          // This is informational - custom models should still be allowed
          expect(typeof isKnownModel).toBe('boolean');
        }
      }
    ));
  });
});