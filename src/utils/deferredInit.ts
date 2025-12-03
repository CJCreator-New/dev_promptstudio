/**
 * Defer heavy initialization until after first paint
 */

export function deferUntilIdle<T>(fn: () => T): Promise<T> {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => resolve(fn()), { timeout: 2000 });
    } else {
      setTimeout(() => resolve(fn()), 1);
    }
  });
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize = 50
): Promise<R[]> {
  const chunks = chunkArray(items, chunkSize);
  const results: R[] = [];
  
  for (const chunk of chunks) {
    await deferUntilIdle(() => {
      chunk.forEach(item => results.push(processor(item)));
    });
  }
  
  return results;
}
