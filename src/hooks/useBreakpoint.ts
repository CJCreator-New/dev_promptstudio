import { useState, useEffect } from 'react';
import { breakpoints, Breakpoint } from '../design-system/responsive/breakpoints';

export const useBreakpoint = () => {
  const [current, setCurrent] = useState<Breakpoint>('lg');

  useEffect(() => {
    const getBreakpoint = (): Breakpoint => {
      const width = window.innerWidth;
      if (width >= breakpoints['2xl']) return '2xl';
      if (width >= breakpoints.xl) return 'xl';
      if (width >= breakpoints.lg) return 'lg';
      if (width >= breakpoints.md) return 'md';
      if (width >= breakpoints.sm) return 'sm';
      return 'xs';
    };

    const handleResize = () => setCurrent(getBreakpoint());
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    current,
    isXs: current === 'xs',
    isSm: current === 'sm',
    isMd: current === 'md',
    isLg: current === 'lg',
    isXl: current === 'xl',
    is2xl: current === '2xl',
    isMobile: current === 'xs' || current === 'sm',
    isTablet: current === 'md',
    isDesktop: current === 'lg' || current === 'xl' || current === '2xl',
  };
};

export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    hasTouch: false,
    hasMouse: false,
    isRetina: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isRetina = window.devicePixelRatio > 1;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setCapabilities({ hasTouch, hasMouse, isRetina, prefersReducedMotion });
  }, []);

  return capabilities;
};
