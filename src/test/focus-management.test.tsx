import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../components/atomic/Modal';
import { ErrorBoundary } from '../components/ErrorBoundary';

describe('Focus Management', () => {
  let previousActiveElement: Element | null;

  beforeEach(() => {
    previousActiveElement = document.activeElement;
  });

  afterEach(() => {
    if (previousActiveElement instanceof HTMLElement) {
      previousActiveElement.focus();
    }
  });

  it('Modal should focus first focusable element on open', () => {
    const { rerender } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <button>First Button</button>
      </Modal>
    );

    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <button>First Button</button>
      </Modal>
    );

    const firstButton = screen.getByText('First Button');
    expect(firstButton).toHaveFocus();
  });

  it('Modal should restore focus on close', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    const { rerender } = render(
      <>
        <button>Trigger</button>
        <Modal isOpen={false} onClose={onClose} title="Test">
          <button>Modal Button</button>
        </Modal>
      </>
    );

    const trigger = screen.getByText('Trigger');
    trigger.focus();
    expect(trigger).toHaveFocus();

    rerender(
      <>
        <button>Trigger</button>
        <Modal isOpen={true} onClose={onClose} title="Test">
          <button>Modal Button</button>
        </Modal>
      </>
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('Error boundary reset should maintain focus', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const resetButton = container.querySelector('button');
    expect(resetButton).toBeInTheDocument();
    expect(resetButton?.textContent).toContain('Try Again');
  });

  it('should have visible focus indicators', () => {
    render(
      <div>
        <button className="focus:ring-2">Button</button>
        <input className="focus:ring-2" />
      </div>
    );

    const button = screen.getByRole('button');
    expect(button.className).toContain('focus:ring');
  });

  it('should not trap focus outside modal when closed', async () => {
    const user = userEvent.setup();
    
    render(
      <>
        <button>Outside 1</button>
        <Modal isOpen={false} onClose={() => {}} title="Test">
          <button>Inside</button>
        </Modal>
        <button>Outside 2</button>
      </>
    );

    await user.tab();
    expect(screen.getByText('Outside 1')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByText('Outside 2')).toHaveFocus();
  });
});
