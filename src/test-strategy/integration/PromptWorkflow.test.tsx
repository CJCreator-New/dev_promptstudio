import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { mockEnhancePrompt } from '../mocks/apiMocks';

describe('Prompt Enhancement Workflow - Integration', () => {
  beforeEach(() => {
    localStorage.setItem('skipAuth', 'true');
    mockEnhancePrompt.mockResolvedValue('Enhanced prompt result');
  });

  it('completes full enhancement workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Enter prompt
    const input = screen.getByRole('textbox', { name: /prompt input/i });
    await user.type(input, 'Create a React component');

    // Select domain
    const domainSelect = screen.getByLabelText(/domain/i);
    await user.selectOptions(domainSelect, 'Frontend');

    // Enhance
    const enhanceBtn = screen.getByRole('button', { name: /enhance/i });
    await user.click(enhanceBtn);

    // Verify output
    await waitFor(() => {
      expect(screen.getByText(/enhanced prompt result/i)).toBeInTheDocument();
    });

    // Verify history updated
    expect(screen.getByRole('list', { name: /history/i })).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    mockEnhancePrompt.mockRejectedValue(new Error('API Error'));
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Test prompt');
    
    const enhanceBtn = screen.getByRole('button', { name: /enhance/i });
    await user.click(enhanceBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
    });
  });
});
