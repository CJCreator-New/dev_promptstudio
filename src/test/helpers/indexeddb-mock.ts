/**
 * IndexedDB mocking utilities for testing
 */

export const mockIndexedDB = () => {
  const store = new Map<string, any>();

  return {
    open: vi.fn(() => ({
      result: {
        transaction: vi.fn(() => ({
          objectStore: vi.fn(() => ({
            add: vi.fn((data) => {
              const id = Date.now();
              store.set(id.toString(), { ...data, id });
              return { result: id };
            }),
            put: vi.fn((data) => {
              store.set(data.id.toString(), data);
              return { result: data.id };
            }),
            get: vi.fn((id) => ({ result: store.get(id.toString()) })),
            delete: vi.fn((id) => {
              store.delete(id.toString());
              return { result: undefined };
            }),
            getAll: vi.fn(() => ({ result: Array.from(store.values()) })),
            clear: vi.fn(() => {
              store.clear();
              return { result: undefined };
            }),
          })),
        })),
      },
    })),
    deleteDatabase: vi.fn(),
  };
};

export const setupIndexedDBMock = () => {
  const mock = mockIndexedDB();
  global.indexedDB = mock as any;
  return mock;
};

export const cleanupIndexedDBMock = () => {
  delete (global as any).indexedDB;
};
