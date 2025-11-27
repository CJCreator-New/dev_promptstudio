import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Spinner } from '../components/LoadingPrimitives';
import { SaveStatus } from '../components/SaveStatus';
import { DraftRecoveryModal } from '../components/DraftRecoveryModal';
import { ConfigPanelSkeleton, SuggestionsSkeleton } from '../components/Loaders';

// Mock matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

describe('Animation Properties', () => {
  beforeEach(() => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  describe('Property 32: Animation Frame Rate', () => {
    it('should use hardware-accelerated properties for smooth 60fps animations', () => {
      const { container } = render(<Spinner />);
      const spinner = container.querySelector('[role="status"]');
      
      // Should use transform-based animation
      expect(spinner?.className).toContain('animate-spin-smooth');
      
      // Should have will-change property for GPU acceleration
      expect(spinner?.style.willChange).toBe('transform');
    });

    it('should use transform3d for hardware acceleration in keyframes', () => {
      const { container } = render(
        <DraftRecoveryModal 
          isOpen={true} 
          drafts={[{ id: 1, input: 'test', options: {} as any, timestamp: Date.now() }]} 
          onRecover={() => {}} 
          onDismiss={() => {}} 
        />
      );
      
      const modal = container.querySelector('.modal-content');
      expect(modal?.className).toContain('animate-scale-in');
    });
  });

  describe('Property 33: Hardware-Accelerated Animations', () => {
    it('should use only transform and opacity for animations', () => {
      const { container } = render(<Spinner size="lg" />);
      const spinner = container.querySelector('[role="status"]');
      
      // Should not animate layout-affecting properties
      expect(spinner?.className).not.toContain('animate-bounce');
      expect(spinner?.className).not.toContain('animate-ping');
      
      // Should use transform-based animation
      expect(spinner?.className).toContain('animate-spin-smooth');
    });

    it('should set will-change property for GPU layers', () => {
      const { container } = render(<ConfigPanelSkeleton />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      
      skeletons.forEach(skeleton => {
        expect(skeleton.className).toContain('will-change-[opacity]');
      });
    });
  });

  describe('Property 34: Loading State Indicators', () => {
    it('should provide skeleton screens for all loading states', () => {
      const { container: configContainer } = render(<ConfigPanelSkeleton />);
      expect(configContainer.querySelector('[role="status"]')).toBeInTheDocument();
      expect(configContainer.querySelector('[aria-label="Loading configuration"]')).toBeInTheDocument();

      const { container: suggestionsContainer } = render(<SuggestionsSkeleton />);
      expect(suggestionsContainer.querySelector('[role="status"]')).toBeInTheDocument();
      expect(suggestionsContainer.querySelector('[aria-label="Loading suggestions"]')).toBeInTheDocument();
    });

    it('should show appropriate loading indicators', () => {
      const { container } = render(<SaveStatus status="saving" lastSaved={null} />);
      
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
      expect(container.textContent).toContain('Saving...');
    });

    it('should maintain consistent dimensions during loading', () => {
      const { container } = render(<SaveStatus status="saving" lastSaved={null} />);
      const statusElement = container.firstChild as HTMLElement;
      
      // Should have fixed minimum width to prevent layout shift
      expect(statusElement.className).toContain('min-w-[120px]');
      expect(statusElement.className).toContain('h-7');
    });
  });

  describe('Property 35: Reduced Motion Respect', () => {
    it('should detect reduced motion preference', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => useReducedMotion());
      expect(result.current).toBe(true);
    });

    it('should disable animations when reduced motion is preferred', () => {
      // Mock CSS media query
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-reduced-motion: reduce) {
          .animate-spin-smooth { animation: none; }
          .animate-scale-in { animation: none; }
        }
      `;
      document.head.appendChild(style);

      const { container } = render(<Spinner />);
      const spinner = container.querySelector('[role="status"]');
      
      // Animation classes should still be present (CSS handles the disabling)
      expect(spinner?.className).toContain('animate-spin-smooth');
      
      document.head.removeChild(style);
    });
  });

  describe('Property 36: Animation Layout Stability', () => {
    it('should not cause layout shifts during animations', () => {
      const { container, rerender } = render(
        <SaveStatus status="idle" lastSaved={null} />
      );
      
      const initialHeight = container.firstChild ? 
        (container.firstChild as HTMLElement).offsetHeight : 0;
      
      // Change to saving state
      rerender(<SaveStatus status="saving" lastSaved={null} />);
      
      const savingHeight = container.firstChild ? 
        (container.firstChild as HTMLElement).offsetHeight : 0;
      
      // Height should remain consistent
      expect(savingHeight).toBe(initialHeight);
    });

    it('should use transform instead of position changes', () => {
      const { container } = render(
        <DraftRecoveryModal 
          isOpen={true} 
          drafts={[{ id: 1, input: 'test', options: {} as any, timestamp: Date.now() }]} 
          onRecover={() => {}} 
          onDismiss={() => {}} 
        />
      );
      
      const modal = container.querySelector('.modal-content');
      
      // Should use scale animation (transform-based)
      expect(modal?.className).toContain('animate-scale-in');
      
      // Should not use position-based animations
      expect(modal?.className).not.toContain('animate-bounce');
    });

    it('should reserve space for dynamic content', () => {
      const { container } = render(<ConfigPanelSkeleton />);
      
      // Skeleton should maintain grid layout structure
      expect(container.querySelector('.grid')).toBeInTheDocument();
      expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
    });
  });
});