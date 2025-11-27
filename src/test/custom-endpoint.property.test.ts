import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { useCustomEndpointStore } from '../store/customEndpointStore';
import { resetStores } from './helpers/store-reset';

describe('Custom Endpoint Properties', () => {
  beforeEach(() => {
    resetStores();
  });

  // Property 54: Custom Endpoint Validation
  it('Property 54: validates endpoint URLs correctly', () => {
    fc.assert(fc.property(
      fc.oneof(
        fc.constant('https://api.example.com/v1'),
        fc.constant('http://localhost:3000'),
        fc.constant('invalid-url'),
        fc.constant('ftp://invalid.com'),
        fc.constant(''),
        fc.webUrl()
      ),
      (url) => {
        const store = useCustomEndpointStore.getState();
        const isValid = store.validateUrl(url);
        
        if (url.startsWith('https://') || url.startsWith('http://')) {
          try {
            new URL(url);
            expect(isValid).toBe(true);
          } catch {
            expect(isValid).toBe(false);
          }
        } else {
          expect(isValid).toBe(false);
        }
      }
    ));
  });

  // Property 55: Custom Header Inclusion
  it('Property 55: manages custom headers correctly', () => {
    fc.assert(fc.property(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }),
        url: fc.webUrl(),
        method: fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
        timeout: fc.integer({ min: 1000, max: 60000 }),
        retryCount: fc.integer({ min: 0, max: 5 }),
        enabled: fc.boolean()
      }),
      fc.array(fc.record({
        key: fc.string({ minLength: 1, maxLength: 30 }),
        value: fc.string({ minLength: 1, maxLength: 100 })
      }), { minLength: 0, maxLength: 10 }),
      (endpointData, headerData) => {
        const store = useCustomEndpointStore.getState();
        
        // Add endpoint
        store.addEndpoint({
          ...endpointData,
          headers: [],
          requestTransformers: [],
          responseTransformers: []
        });
        
        const addedEndpoint = useCustomEndpointStore.getState().endpoints[0];
        expect(addedEndpoint).toBeDefined();
        
        // Add headers
        headerData.forEach(header => {
          store.addHeader(addedEndpoint.id, header);
        });
        
        const updatedEndpoint = useCustomEndpointStore.getState().endpoints[0];
        expect(updatedEndpoint.headers.length).toBe(headerData.length);
        
        // Verify headers are correctly stored
        headerData.forEach((header, index) => {
          expect(updatedEndpoint.headers[index].key).toBe(header.key);
          expect(updatedEndpoint.headers[index].value).toBe(header.value);
          expect(updatedEndpoint.headers[index].enabled).toBe(true);
        });
        
        // Test header removal
        if (headerData.length > 0) {
          const firstHeaderKey = headerData[0].key;
          store.removeHeader(addedEndpoint.id, firstHeaderKey);
          
          const finalEndpoint = useCustomEndpointStore.getState().endpoints[0];
          expect(finalEndpoint.headers.length).toBe(headerData.length - 1);
          expect(finalEndpoint.headers.find(h => h.key === firstHeaderKey)).toBeUndefined();
        }
      }
    ));
  });

  // Property 56: Request/Response Transform
  it('Property 56: handles request and response transformers', () => {
    fc.assert(fc.property(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }),
        url: fc.webUrl(),
        method: fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
        timeout: fc.integer({ min: 1000, max: 60000 }),
        retryCount: fc.integer({ min: 0, max: 5 }),
        enabled: fc.boolean()
      }),
      fc.array(fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        enabled: fc.boolean()
      }), { minLength: 0, maxLength: 5 }),
      fc.array(fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        enabled: fc.boolean()
      }), { minLength: 0, maxLength: 5 }),
      (endpointData, requestTransformers, responseTransformers) => {
        const store = useCustomEndpointStore.getState();
        
        // Add endpoint
        store.addEndpoint({
          ...endpointData,
          headers: [],
          requestTransformers: [],
          responseTransformers: []
        });
        
        const addedEndpoint = useCustomEndpointStore.getState().endpoints[0];
        expect(addedEndpoint).toBeDefined();
        
        // Add request transformers
        requestTransformers.forEach(transformer => {
          store.addRequestTransformer(addedEndpoint.id, {
            ...transformer,
            transform: (req: any) => ({ ...req, transformed: true })
          });
        });
        
        // Add response transformers
        responseTransformers.forEach(transformer => {
          store.addResponseTransformer(addedEndpoint.id, {
            ...transformer,
            transform: (res: any) => ({ ...res, transformed: true })
          });
        });
        
        const updatedEndpoint = useCustomEndpointStore.getState().endpoints[0];
        
        // Verify transformers are stored
        expect(updatedEndpoint.requestTransformers.length).toBe(requestTransformers.length);
        expect(updatedEndpoint.responseTransformers.length).toBe(responseTransformers.length);
        
        // Verify transformer properties
        requestTransformers.forEach((transformer, index) => {
          expect(updatedEndpoint.requestTransformers[index].id).toBe(transformer.id);
          expect(updatedEndpoint.requestTransformers[index].name).toBe(transformer.name);
          expect(updatedEndpoint.requestTransformers[index].enabled).toBe(transformer.enabled);
          expect(typeof updatedEndpoint.requestTransformers[index].transform).toBe('function');
        });
        
        responseTransformers.forEach((transformer, index) => {
          expect(updatedEndpoint.responseTransformers[index].id).toBe(transformer.id);
          expect(updatedEndpoint.responseTransformers[index].name).toBe(transformer.name);
          expect(updatedEndpoint.responseTransformers[index].enabled).toBe(transformer.enabled);
          expect(typeof updatedEndpoint.responseTransformers[index].transform).toBe('function');
        });
      }
    ));
  });

  it('Property: Endpoint lifecycle management', () => {
    fc.assert(fc.property(
      fc.array(fc.record({
        name: fc.string({ minLength: 1, maxLength: 50 }),
        url: fc.webUrl(),
        method: fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
        timeout: fc.integer({ min: 1000, max: 60000 }),
        retryCount: fc.integer({ min: 0, max: 5 }),
        enabled: fc.boolean()
      }), { minLength: 1, maxLength: 10 }),
      (endpoints) => {
        const store = useCustomEndpointStore.getState();
        
        // Add all endpoints
        endpoints.forEach(endpoint => {
          store.addEndpoint({
            ...endpoint,
            headers: [],
            requestTransformers: [],
            responseTransformers: []
          });
        });
        
        const addedEndpoints = useCustomEndpointStore.getState().endpoints;
        expect(addedEndpoints.length).toBe(endpoints.length);
        
        // Verify each endpoint has required properties
        addedEndpoints.forEach((endpoint, index) => {
          expect(endpoint.id).toBeDefined();
          expect(endpoint.createdAt).toBeDefined();
          expect(endpoint.name).toBe(endpoints[index].name);
          expect(endpoint.url).toBe(endpoints[index].url);
          expect(endpoint.method).toBe(endpoints[index].method);
        });
        
        // Test updates
        if (addedEndpoints.length > 0) {
          const firstEndpoint = addedEndpoints[0];
          const newName = 'Updated Endpoint Name';
          
          store.updateEndpoint(firstEndpoint.id, { name: newName });
          
          const updatedEndpoints = useCustomEndpointStore.getState().endpoints;
          expect(updatedEndpoints[0].name).toBe(newName);
        }
        
        // Test removal
        addedEndpoints.forEach(endpoint => {
          store.removeEndpoint(endpoint.id);
        });
        
        const finalEndpoints = useCustomEndpointStore.getState().endpoints;
        expect(finalEndpoints.length).toBe(0);
      }
    ));
  });
});