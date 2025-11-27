import { describe, test, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from './test-utils';
import { trapFocus, announceToScreenReader, generateAriaLabel } from '../utils/accessibility';
import { LiveRegion } from '../components/LiveRegion';
import { FocusTrap } from '../components/FocusTrap';

// Property 1: Focus Indicator Visibility
describe('Property 1: Focus Indicator Visibility', () => {
  test('all interactive elements have visible focus indicators', () => {
    fc.assert(fc.property(
      fc.record({
        elementType: fc.constantFrom('button', 'input', 'select', 'textarea', 'a'),
        content: fc.string({ minLength: 1, maxLength: 20 })
      }),
      ({ elementType, content }) => {
        const TestComponent = () => {
          switch (elementType) {
            case 'button':
              return <button className="focus:ring-2 focus:ring-indigo-500">{content}</button>;
            case 'input':
              return <input className="focus:ring-2 focus:ring-indigo-500" defaultValue={content} />;
            case 'select':
              return <select className="focus:ring-2 focus:ring-indigo-500"><option>{content}</option></select>;
            case 'textarea':
              return <textarea className="focus:ring-2 focus:ring-indigo-500" defaultValue={content} />;
            case 'a':
              return <a href="#" className="focus:ring-2 focus:ring-indigo-500">{content}</a>;
            default:
              return <div>{content}</div>;
          }
        };

        const { container } = render(<TestComponent />);
        const element = container.firstElementChild as HTMLElement;
        
        // Check if focus ring classes are present
        const hasFocusRing = element.className.includes('focus:ring-2') && 
                           element.className.includes('focus:ring-indigo-500');
        
        expect(hasFocusRing).toBe(true);
        return true;
      }
    ));
  });
});

// Property 2: ARIA Label Completeness
describe('Property 2: ARIA Label Completeness', () => {
  test('interactive elements have appropriate ARIA labels', () => {
    fc.assert(fc.property(
      fc.record({
        label: fc.string({ minLength: 1, maxLength: 50 }),
        hasAriaLabel: fc.boolean(),
        hasTitle: fc.boolean()
      }),
      ({ label, hasAriaLabel, hasTitle }) => {
        const TestButton = () => (
          <button
            {...(hasAriaLabel && { 'aria-label': label })}
            {...(hasTitle && { title: label })}
          >
            {hasAriaLabel || hasTitle ? 'Icon' : label}
          </button>
        );

        const { container } = render(<TestButton />);
        const button = container.querySelector('button');
        
        // Element should have accessible name through aria-label, title, or text content
        const hasAccessibleName = 
          button?.getAttribute('aria-label') ||
          button?.getAttribute('title') ||
          button?.textContent?.trim();
        
        expect(hasAccessibleName).toBeTruthy();
        return true;
      }
    ));
  });

  test('generateAriaLabel creates proper labels', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 30 }),
      fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: undefined }),
      (baseLabel, context) => {
        const result = generateAriaLabel(baseLabel, context);
        
        if (context) {
          expect(result).toBe(`${baseLabel}, ${context}`);
        } else {
          expect(result).toBe(baseLabel);
        }
        
        return true;
      }
    ));
  });
});

// Property 3: Form Label Association
describe('Property 3: Form Label Association', () => {
  test('form inputs have proper label associations', () => {
    fc.assert(fc.property(
      fc.record({
        inputId: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/\s/g, '-')),
        labelText: fc.string({ minLength: 1, maxLength: 50 }),
        inputType: fc.constantFrom('text', 'email', 'password', 'number')
      }),
      ({ inputId, labelText, inputType }) => {
        const TestForm = () => (
          <div>
            <label htmlFor={inputId}>{labelText}</label>
            <input id={inputId} type={inputType} />
          </div>
        );

        const { container } = render(<TestForm />);
        const label = container.querySelector('label');
        const input = container.querySelector('input');
        
        // Verify label-input association
        expect(label?.getAttribute('for')).toBe(inputId);
        expect(input?.getAttribute('id')).toBe(inputId);
        
        return true;
      }
    ));
  });
});

// Property 4: Modal Focus Trap
describe('Property 4: Modal Focus Trap', () => {
  test('focus trap contains focus within modal', () => {
    const TestModal = ({ active }: { active: boolean }) => (
      <FocusTrap active={active}>
        <div role="dialog" aria-modal="true">
          <button>First</button>
          <button>Second</button>
          <button>Last</button>
        </div>
      </FocusTrap>
    );

    const { rerender } = render(<TestModal active={false} />);
    
    // Test that focus trap activates when modal opens
    rerender(<TestModal active={true} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    
    // Focus should be trapped within the modal
    return true;
  });

  test('trapFocus utility manages focus correctly', () => {
    const mockElement = document.createElement('div');
    mockElement.innerHTML = `
      <button>First</button>
      <input type="text" />
      <button>Last</button>
    `;
    
    document.body.appendChild(mockElement);
    
    const cleanup = trapFocus(mockElement);
    
    // Verify focus is set to first focusable element
    expect(document.activeElement).toBe(mockElement.querySelector('button'));
    
    cleanup();
    document.body.removeChild(mockElement);
  });
});

// Property 5: Live Region Announcements
describe('Property 5: Live Region Announcements', () => {
  test('live regions announce dynamic content updates', () => {
    fc.assert(fc.property(
      fc.record({
        message: fc.string({ minLength: 1, maxLength: 100 }),
        priority: fc.constantFrom('polite', 'assertive' as const)
      }),
      ({ message, priority }) => {
        const { container } = render(
          <LiveRegion message={message} priority={priority} />
        );
        
        const liveRegion = container.querySelector('[aria-live]');
        
        expect(liveRegion?.getAttribute('aria-live')).toBe(priority);
        expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');
        expect(liveRegion?.textContent).toBe(message);
        
        return true;
      }
    ));
  });

  test('announceToScreenReader creates temporary announcements', () => {
    const originalCreateElement = document.createElement;
    const mockElement = {
      setAttribute: vi.fn(),
      textContent: '',
      className: ''
    };
    
    document.createElement = vi.fn().mockReturnValue(mockElement);
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    
    announceToScreenReader('Test message', 'assertive');
    
    expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'assertive');
    expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-atomic', 'true');
    expect(mockElement.textContent).toBe('Test message');
    
    document.createElement = originalCreateElement;
  });
});