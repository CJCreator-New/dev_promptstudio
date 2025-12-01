import { render } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Save, Download } from 'lucide-react';

describe('Visual Components', () => {
  test('Button variants render correctly', () => {
    const { container } = render(
      <div>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
    );
    expect(container).toMatchSnapshot();
  });

  test('Button sizes render correctly', () => {
    const { container } = render(
      <div>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    );
    expect(container).toMatchSnapshot();
  });

  test('Button with icons render correctly', () => {
    const { container } = render(
      <div>
        <Button icon={Save} iconPosition="left">Save</Button>
        <Button icon={Download} iconPosition="right">Download</Button>
        <Button loading>Loading</Button>
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});