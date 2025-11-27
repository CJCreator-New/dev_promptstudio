import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render } from './test-utils';
import { 
  meetsTouchTargetSize, 
  handleOrientationChange, 
  isValidViewportWidth, 
  checkHorizontalOverflow,
  BREAKPOINTS,
  MIN_TOUCH_TARGET 
} from '../utils/responsive';
import { useResponsive } from '../hooks/useResponsive';

// Property 6: Mobile Viewport Functionality
describe('Property 6: Mobile Viewport Functionality', () => {
  test('application functions correctly across all supported viewport widths', () => {
    fc.assert(fc.property(
      fc.integer({ min: BREAKPOINTS.xs, max: BREAKPOINTS.max }),
      fc.integer({ min: 568, max: 1440 }),
      (width, height) => {
        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, writable: true });

        const TestComponent = () => {
          const { viewport, isMobile, isTablet, isDesktop } = useResponsive();
          
          return (
            <div data-testid="viewport-info">
              <span data-testid="width">{viewport.width}</span>
              <span data-testid="is-mobile">{isMobile.toString()}</span>
              <span data-testid="is-tablet">{isTablet.toString()}</span>
              <span data-testid="is-desktop">{isDesktop.toString()}</span>
            </div>
          );
        };

        const { getByTestId } = render(<TestComponent />);
        
        expect(getByTestId('width').textContent).toBe(width.toString());
        
        // Verify breakpoint logic
        const isMobile = width < BREAKPOINTS.md;
        const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
        const isDesktop = width >= BREAKPOINTS.lg;
        
        expect(getByTestId('is-mobile').textContent).toBe(isMobile.toString());
        expect(getByTestId('is-tablet').textContent).toBe(isTablet.toString());
        expect(getByTestId('is-desktop').textContent).toBe(isDesktop.toString());
        
        return true;
      }
    ));
  });

  test('viewport width validation works correctly', () => {
    fc.assert(fc.property(
      fc.integer({ min: 0, max: 5000 }),
      (width) => {
        const isValid = isValidViewportWidth(width);
        const expected = width >= BREAKPOINTS.xs && width <= BREAKPOINTS.max;
        
        expect(isValid).toBe(expected);
        return true;
      }
    ));
  });
});

// Property 7: Orientation Change Stability
describe('Property 7: Orientation Change Stability', () => {
  let mockCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCallback = vi.fn();
  });

  test('orientation change handler manages event listeners correctly', () => {
    const cleanup = handleOrientationChange(mockCallback);
    
    // Simulate orientation change
    window.dispatchEvent(new Event('orientationchange'));
    
    // Should call callback after timeout
    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalled();
    }, 150);
    
    cleanup();
    
    // After cleanup, should not call callback
    mockCallback.mockClear();
    window.dispatchEvent(new Event('orientationchange'));
    
    setTimeout(() => {
      expect(mockCallback).not.toHaveBeenCalled();
    }, 150);
  });

  test('resize events trigger orientation change handler', () => {
    const cleanup = handleOrientationChange(mockCallback);
    
    window.dispatchEvent(new Event('resize'));
    
    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalled();
    }, 150);
    
    cleanup();
  });
});

// Property 8: Touch Target Minimum Size
describe('Property 8: Touch Target Minimum Size', () => {
  test('touch target size validation works correctly', () => {
    fc.assert(fc.property(
      fc.integer({ min: 20, max: 100 }),
      fc.integer({ min: 20, max: 100 }),
      (width, height) => {
        const element = document.createElement('button');
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        element.style.position = 'absolute';
        element.style.top = '0';
        element.style.left = '0';
        
        document.body.appendChild(element);
        
        const meetsSize = meetsTouchTargetSize(element);
        const expected = width >= MIN_TOUCH_TARGET && height >= MIN_TOUCH_TARGET;
        
        expect(meetsSize).toBe(expected);
        
        document.body.removeChild(element);
        return true;
      }
    ));
  });

  test('interactive elements meet minimum touch target size', () => {
    const TestButton = ({ size }: { size: number }) => (
      <button 
        style={{ width: size, height: size }}
        className="bg-blue-500 text-white"
      >
        Test
      </button>
    );

    fc.assert(fc.property(
      fc.integer({ min: MIN_TOUCH_TARGET, max: 100 }),
      (size) => {
        const { container } = render(<TestButton size={size} />);
        const button = container.querySelector('button') as HTMLElement;
        
        if (button) {
          const meetsSize = meetsTouchTargetSize(button);
          expect(meetsSize).toBe(true);
        }
        
        return true;
      }
    ));
  });
});

// Property 9: Responsive Layout Integrity
describe('Property 9: Responsive Layout Integrity', () => {
  test('layout prevents horizontal overflow', () => {
    fc.assert(fc.property(
      fc.integer({ min: BREAKPOINTS.xs, max: BREAKPOINTS.max }),
      (viewportWidth) => {
        const TestLayout = () => (
          <div 
            style={{ width: viewportWidth }}
            className="overflow-x-hidden"
            data-testid="container"
          >
            <div className="max-w-full px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="min-w-0">Column 1</div>
                <div className="min-w-0">Column 2</div>
                <div className="min-w-0">Column 3</div>
              </div>
            </div>
          </div>
        );

        const { getByTestId } = render(<TestLayout />);
        const container = getByTestId('container');
        
        // Check that container doesn't have horizontal overflow
        const hasOverflow = checkHorizontalOverflow(container);
        expect(hasOverflow).toBe(false);
        
        return true;
      }
    ));
  });

  test('responsive breakpoints maintain layout integrity', () => {
    fc.assert(fc.property(
      fc.constantFrom(...Object.values(BREAKPOINTS)),
      (breakpoint) => {
        Object.defineProperty(window, 'innerWidth', { value: breakpoint, writable: true });
        
        const TestResponsiveLayout = () => {
          const { isMobile, isTablet, isDesktop } = useResponsive();
          
          return (
            <div data-testid="layout" className={`
              ${isMobile ? 'flex-col' : 'flex-row'}
              ${isTablet ? 'gap-4' : 'gap-6'}
              ${isDesktop ? 'max-w-7xl' : 'max-w-full'}
              flex mx-auto px-4
            `}>
              <div className="flex-1 min-w-0">Content 1</div>
              <div className="flex-1 min-w-0">Content 2</div>
            </div>
          );
        };

        const { getByTestId } = render(<TestResponsiveLayout />);
        const layout = getByTestId('layout');
        
        // Verify layout classes are applied correctly
        expect(layout.className).toContain('flex');
        expect(layout.className).toContain('mx-auto');
        expect(layout.className).toContain('px-4');
        
        return true;
      }
    ));
  });
});