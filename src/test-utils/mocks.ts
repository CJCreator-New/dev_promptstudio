export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); })
  };
};

export const mockApiResponse = (data: any, delay = 0) => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const mockStreamingResponse = async function* (chunks: string[]) {
  for (const chunk of chunks) {
    yield chunk;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
};

export const mockFirebaseAuth = {
  onAuthStateChanged: jest.fn((callback) => {
    callback({ uid: 'test-user', email: 'test@example.com' });
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(() => 
    Promise.resolve({ user: { uid: 'test-user', email: 'test@example.com' } })
  ),
  signOut: jest.fn(() => Promise.resolve())
};

export const mockIndexedDB = () => {
  const store: Record<string, any> = {};
  
  return {
    add: jest.fn((item: any) => { store[item.id] = item; return Promise.resolve(item.id); }),
    get: jest.fn((id: string) => Promise.resolve(store[id])),
    toArray: jest.fn(() => Promise.resolve(Object.values(store))),
    clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); return Promise.resolve(); }),
    delete: jest.fn((id: string) => { delete store[id]; return Promise.resolve(); })
  };
};
