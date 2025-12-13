import { render, screen } from '@testing-library/react';
import { HubAndSpoke, Hierarchy, Sequential, Matrix } from '@/ia/templates/IAPatterns';

describe('IAPatterns - Unit Tests', () => {
  describe('HubAndSpoke', () => {
    it('renders hub and spokes', () => {
      render(
        <HubAndSpoke 
          hub={<div>Hub Content</div>}
          spokes={[<div key="1">Spoke 1</div>, <div key="2">Spoke 2</div>]}
        />
      );
      expect(screen.getByText('Hub Content')).toBeInTheDocument();
      expect(screen.getByText('Spoke 1')).toBeInTheDocument();
    });

    it('has accessible navigation structure', () => {
      render(<HubAndSpoke hub={<div>Hub</div>} spokes={[]} />);
      expect(screen.getByRole('region', { name: /hub and spoke/i })).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Sequential', () => {
    const steps = [
      { title: 'Step 1', content: <div>Content 1</div> },
      { title: 'Step 2', content: <div>Content 2</div> }
    ];

    it('renders current step content', () => {
      render(<Sequential steps={steps} currentStep={0} />);
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('marks current step with aria-current', () => {
      render(<Sequential steps={steps} currentStep={1} />);
      const step2 = screen.getByLabelText(/Step 2.*current/i);
      expect(step2).toHaveAttribute('aria-current', 'step');
    });
  });

  describe('Matrix', () => {
    it('renders table with proper semantics', () => {
      const cells = { 'A-1': <span>Cell A1</span> };
      render(<Matrix rows={['A']} cols={['1']} cells={cells} caption="Test matrix" />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Test matrix')).toHaveClass('sr-only');
    });

    it('uses scope attributes for headers', () => {
      const cells = { 'A-1': <span>Data</span> };
      const { container } = render(<Matrix rows={['A']} cols={['1']} cells={cells} />);
      
      const colHeader = container.querySelector('thead th[scope="col"]');
      const rowHeader = container.querySelector('tbody th[scope="row"]');
      expect(colHeader).toBeInTheDocument();
      expect(rowHeader).toBeInTheDocument();
    });
  });
});
