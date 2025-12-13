import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useBreakpoint, useDeviceCapabilities } from '../../../hooks/useBreakpoint';
import { Grid, Container, Stack } from '../../layout/Grid';
import { TouchTarget, Swipeable } from '../TouchInteractions';
import { ResponsiveTable } from '../ResponsiveTable';

describe('Responsive System', () => {
  describe('useBreakpoint', () => {
    it('detects mobile breakpoint', () => {
      global.innerWidth = 375;
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.isMobile).toBe(true);
    });

    it('detects desktop breakpoint', () => {
      global.innerWidth = 1920;
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.isDesktop).toBe(true);
    });
  });

  describe('Grid', () => {
    it('renders with responsive columns', () => {
      const { container } = render(
        <Grid cols={{ xs: 1, md: 2, lg: 3 }}>
          <div>Item 1</div>
        </Grid>
      );
      expect(container.firstChild).toHaveClass('grid');
    });
  });

  describe('TouchTarget', () => {
    it('handles tap events', () => {
      const onTap = jest.fn();
      render(<TouchTarget onTap={onTap}><span>Tap</span></TouchTarget>);
      fireEvent.click(screen.getByText('Tap'));
      expect(onTap).toHaveBeenCalled();
    });
  });

  describe('Swipeable', () => {
    it('handles swipe left', () => {
      const onSwipeLeft = jest.fn();
      const { container } = render(
        <Swipeable onSwipeLeft={onSwipeLeft}><div>Swipe</div></Swipeable>
      );
      const element = container.firstChild as HTMLElement;
      fireEvent.touchStart(element, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(element, { changedTouches: [{ clientX: 0 }] });
      expect(onSwipeLeft).toHaveBeenCalled();
    });
  });

  describe('ResponsiveTable', () => {
    const columns = [{ key: 'name', label: 'Name' }];
    const data = [{ id: 1, name: 'John' }];

    it('renders table', () => {
      render(<ResponsiveTable columns={columns} data={data} keyField="id" />);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });
});
