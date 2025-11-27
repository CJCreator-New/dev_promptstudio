import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../components/atomic/Modal';
import { Button } from '../components/atomic/Button';
import { Dropdown } from '../components/atomic/Dropdown';

describe('Keyboard Navigation Testing', () => {
  it('should navigate through buttons with Tab', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </div>
    );

    await user.tab();
    expect(screen.getByText('First')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByText('Second')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByText('Third')).toHaveFocus();
  });

  it('should navigate backwards with Shift+Tab', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Button>First</Button>
        <Button>Second</Button>
      </div>
    );

    await user.tab();
    await user.tab();
    expect(screen.getByText('Second')).toHaveFocus();
    
    await user.tab({ shift: true });
    expect(screen.getByText('First')).toHaveFocus();
  });

  it('should activate button with Enter', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click Me</Button>);

    const button = screen.getByText('Click Me');
    button.focus();
    await user.keyboard('{Enter}');
    
    expect(onClick).toHaveBeenCalled();
  });

  it('should activate button with Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click Me</Button>);

    const button = screen.getByText('Click Me');
    button.focus();
    await user.keyboard(' ');
    
    expect(onClick).toHaveBeenCalled();
  });

  it('Modal should trap focus within dialog', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <button>First</button>
        <button>Second</button>
      </Modal>
    );

    await user.tab();
    const firstButton = screen.getByText('First');
    expect(firstButton).toHaveFocus();
    
    await user.tab();
    const secondButton = screen.getByText('Second');
    expect(secondButton).toHaveFocus();
    
    await user.tab();
    expect(firstButton).toHaveFocus();
  });

  it('Modal should close with Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('Dropdown should open with Enter', async () => {
    const user = userEvent.setup();
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ];
    
    render(
      <Dropdown
        options={options}
        value="1"
        onChange={() => {}}
        label="Test Dropdown"
      />
    );

    const trigger = screen.getByText('Option 1');
    trigger.focus();
    await user.keyboard('{Enter}');
    
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should skip disabled elements in tab order', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Button>First</Button>
        <Button disabled>Disabled</Button>
        <Button>Third</Button>
      </div>
    );

    await user.tab();
    expect(screen.getByText('First')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByText('Third')).toHaveFocus();
  });
});
