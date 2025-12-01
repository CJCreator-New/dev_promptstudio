const CACHE_NAME = 'devprompt-v1';
const RUNTIME_CACHE = 'devprompt-runtime';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event: any) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return caches.open(RUNTIME_CACHE).then((cache) =>
        fetch(event.request).then((response) => {
          if (response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
      );
    })
  );
});

self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-prompts') {
    event.waitUntil(syncPrompts());
  }
});

async function syncPrompts() {
  const db = await openDB();
  const tx = db.transaction('prompts', 'readonly');
  const store = tx.objectStore('prompts');
  const prompts = await store.getAll();
  console.log('Syncing prompts:', prompts.length);
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('devprompt-db', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export {};
