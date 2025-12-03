/**
 * Performance monitoring for Lighthouse optimization
 */

export function markPerformance(name: string) {
  if ('performance' in window && performance.mark) {
    performance.mark(name);
  }
}

export function measurePerformance(name: string, startMark: string, endMark: string) {
  if ('performance' in window && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
    } catch (e) {
      // Marks don't exist yet
    }
  }
}

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
}

// Break up long tasks
export function yieldToMain() {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

export async function runWithYield<T>(tasks: Array<() => T>): Promise<T[]> {
  const results: T[] = [];
  
  for (const task of tasks) {
    results.push(task());
    await yieldToMain();
  }
  
  return results;
}
