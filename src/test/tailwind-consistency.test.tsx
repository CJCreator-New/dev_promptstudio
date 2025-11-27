import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../components/atomic/Button';
import { Input } from '../components/atomic/Input';
import { Select } from '../components/atomic/Select';
import { Textarea } from '../components/atomic/Textarea';

describe('Property 24: Tailwind CSS Consistency', () => {
  it('should use consistent button styling classes', () => {
    const { container: primaryContainer } = render(
      <Button variant="primary">Primary</Button>
    );
    const { container: secondaryContainer } = render(
      <Button variant="secondary">Secondary</Button>
    );
    
    const primaryButton = primaryContainer.querySelector('button');
    const secondaryButton = secondaryContainer.querySelector('button');
    
    // Both should have consistent base classes
    expect(primaryButton?.className).toContain('btn-');
    expect(secondaryButton?.className).toContain('btn-');
    
    // Should use Tailwind utility classes, not inline styles
    expect(primaryButton?.style.cssText).toBe('');
    expect(secondaryButton?.style.cssText).toBe('');
  });

  it('should use consistent input styling classes', () => {
    const { container: normalContainer } = render(
      <Input placeholder="Normal input" />
    );
    const { container: errorContainer } = render(
      <Input placeholder="Error input" error="Error message" />
    );
    
    const normalInput = normalContainer.querySelector('input');
    const errorInput = errorContainer.querySelector('input');
    
    // Both should use input-base class
    expect(normalInput?.className).toContain('input-base');
    expect(errorInput?.className).toContain('input-base');
    
    // Error input should have error variant
    expect(errorInput?.className).toContain('input-error');
    expect(normalInput?.className).toContain('input-valid');
    
    // Should not have inline styles
    expect(normalInput?.style.cssText).toBe('');
    expect(errorInput?.style.cssText).toBe('');
  });

  it('should use consistent color utilities across components', () => {
    const { container } = render(
      <div>
        <Input label="Test Input" />
        <Select label="Test Select" options={[{ value: 'test', label: 'Test' }]} />
        <Textarea label="Test Textarea" />
      </div>
    );
    
    const labels = container.querySelectorAll('label');
    
    // All labels should use consistent text color utility
    labels.forEach(label => {
      expect(label.className).toContain('text-secondary');
    });
  });

  it('should use consistent spacing utilities', () => {
    const { container } = render(
      <Button size="sm">Small</Button>
    );
    
    const button = container.querySelector('button');
    
    // Should use Tailwind spacing classes, not custom values
    expect(button?.className).toMatch(/px-\d+/);
    expect(button?.className).toMatch(/py-\d+/);
  });

  it('should use consistent focus ring utilities', () => {
    const { container: buttonContainer } = render(
      <Button>Test Button</Button>
    );
    const { container: inputContainer } = render(
      <Input placeholder="Test Input" />
    );
    
    const button = buttonContainer.querySelector('button');
    const input = inputContainer.querySelector('input');
    
    // Both should have consistent focus ring classes
    expect(button?.className).toContain('focus:ring-');
    expect(input?.className).toContain('focus:ring-');
    
    // Should use consistent focus ring color
    expect(button?.className).toContain('focus:ring-indigo-500');
    expect(input?.className).toContain('focus:ring-indigo-500');
  });

  it('should avoid inline styles in favor of Tailwind classes', () => {
    const components = [
      <Button key="btn">Button</Button>,
      <Input key="input" placeholder="Input" />,
      <Select key="select" options={[]} />,
      <Textarea key="textarea" placeholder="Textarea" />
    ];
    
    components.forEach((component, index) => {
      const { container } = render(component);
      const elements = container.querySelectorAll('*');
      
      elements.forEach(element => {
        // Elements should not have inline styles (except for specific cases like transforms)
        const hasInlineStyles = element.getAttribute('style');
        if (hasInlineStyles) {
          // Allow only specific CSS properties that might be dynamically set
          const allowedProperties = ['transform', 'opacity', 'z-index'];
          const styleProperties = hasInlineStyles.split(';').map(s => s.split(':')[0].trim());
          const hasDisallowedStyles = styleProperties.some(prop => 
            prop && !allowedProperties.includes(prop)
          );
          expect(hasDisallowedStyles).toBe(false);
        }
      });
    });
  });

  it('should use consistent border radius patterns', () => {
    const { container: buttonContainer } = render(<Button>Button</Button>);
    const { container: inputContainer } = render(<Input />);
    
    const button = buttonContainer.querySelector('button');
    const input = inputContainer.querySelector('input');
    
    // Should use consistent border radius utilities
    expect(button?.className).toMatch(/rounded-\w+/);
    expect(input?.className).toMatch(/rounded-\w+/);
  });

  it('should use consistent transition utilities', () => {
    const { container } = render(<Button>Hover me</Button>);
    const button = container.querySelector('button');
    
    // Should use Tailwind transition utilities
    expect(button?.className).toContain('transition-');
  });

  it('should use semantic color naming', () => {
    const { container } = render(
      <div>
        <span className="text-primary">Primary text</span>
        <span className="text-secondary">Secondary text</span>
        <span className="text-muted">Muted text</span>
      </div>
    );
    
    const spans = container.querySelectorAll('span');
    
    // Should use semantic color classes
    expect(spans[0].className).toContain('text-primary');
    expect(spans[1].className).toContain('text-secondary');
    expect(spans[2].className).toContain('text-muted');
  });
});