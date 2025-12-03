/**
 * Lazy IndexedDB initialization to prevent blocking initial render
 */

import { db } from './db';
import { deferUntilIdle } from './deferredInit';

let dbInitialized = false;

export async function initializeDB() {
  if (dbInitialized) return db;
  
  await deferUntilIdle(async () => {
    // Open DB connection in idle time
    await db.open();
    dbInitialized = true;
  });
  
  return db;
}

export async function getDraftsLazy() {
  await initializeDB();
  return db.drafts.orderBy('timestamp').reverse().limit(10).toArray();
}

export async function saveDraftLazy(draft: any) {
  await initializeDB();
  return db.drafts.add(draft);
}

// Batch operations to reduce IndexedDB overhead
const pendingWrites: Array<() => Promise<any>> = [];
let flushTimeout: any = null;

export function queueWrite(operation: () => Promise<any>) {
  pendingWrites.push(operation);
  
  if (!flushTimeout) {
    flushTimeout = setTimeout(async () => {
      const operations = [...pendingWrites];
      pendingWrites.length = 0;
      flushTimeout = null;
      
      await initializeDB();
      await Promise.all(operations.map(op => op()));
    }, 100);
  }
}
