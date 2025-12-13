import { describe, it, expect } from 'vitest';
import { renderWithProviders, measureRenderTime } from '../utils/testHelpers';
import { Sequential } from '@/ia/templates/IAPatterns';

describe('Performance Benchmarks', () => {
  it('renders large list under 100ms', () => {
    const steps = Array.from({ length: 50 }, (_, i) => ({
      title: `Step ${i}`,
      content: <div>Content {i}</div>
    }));

    const renderTime = measureRenderTime(() => {
      renderWithProviders(<Sequential steps={steps} currentStep={0} />);
    });

    expect(renderTime).toBeLessThan(100);
  });

  it('handles rapid state updates efficiently', async () => {
    const { rerender } = renderWithProviders(
      <Sequential steps={[{ title: 'Step 1', content: <div>Content</div> }]} currentStep={0} />
    );

    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      rerender(<Sequential steps={[{ title: 'Step 1', content: <div>Content</div> }]} currentStep={0} />);
    }
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(500);
  });
});
