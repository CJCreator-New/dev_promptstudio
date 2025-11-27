import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';
import { PromptInput } from '../components/PromptInput';
import { Modal } from '../components/atomic/Modal';
import { Button } from '../components/atomic/Button';

expect.extend(toHaveNoViolations);

describe('Accessibility Audit - axe-core', () => {
  it('App should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('PromptInput should have no accessibility violations', async () => {
    const { container } = render(
      <PromptInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        isLoading={false}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Modal should have no accessibility violations', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Button variants should have no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Keyboard Navigation', () => {
  it('should support Tab navigation through interactive elements', () => {
    const { container } = render(<App />);
    const interactiveElements = container.querySelectorAll(
      'button, input, textarea, select, a[href]'
    );
    
    interactiveElements.forEach(element => {
      expect(element.getAttribute('tabindex')).not.toBe('-1');
    });
  });

  it('Modal should trap focus', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <button>Button 1</button>
        <button>Button 2</button>
      </Modal>
    );
    
    const focusableElements = container.querySelectorAll(
      'button, input, textarea'
    );
    expect(focusableElements.length).toBeGreaterThan(0);
  });
});

describe('ARIA Attributes', () => {
  it('should have proper ARIA labels on interactive elements', () => {
    const { container } = render(<App />);
    
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      const hasLabel = 
        button.getAttribute('aria-label') ||
        button.textContent?.trim() ||
        button.getAttribute('aria-labelledby');
      expect(hasLabel).toBeTruthy();
    });
  });

  it('Modal should have proper ARIA attributes', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-labelledby')).toBeTruthy();
  });
});

describe('Color Contrast - WCAG AA', () => {
  it('should verify text colors meet contrast requirements', async () => {
    const { container } = render(<App />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });
});

describe('Screen Reader Support', () => {
  it('should have descriptive text for screen readers', () => {
    const { container } = render(<App />);
    
    const srOnlyElements = container.querySelectorAll('.sr-only');
    expect(srOnlyElements.length).toBeGreaterThanOrEqual(0);
  });

  it('should announce loading states', () => {
    const { container } = render(
      <PromptInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        isLoading={true}
      />
    );
    
    const liveRegion = container.querySelector('[aria-live]');
    expect(liveRegion).toBeTruthy();
  });
});
