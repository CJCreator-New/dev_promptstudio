import { useState, useEffect } from 'react';
import { BREAKPOINTS, handleOrientationChange } from '../utils/responsive';

export const useResponsive = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.screen?.orientation?.type || 'landscape-primary'
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.screen?.orientation?.type || 'landscape-primary'
      });
    };

    const cleanup = handleOrientationChange(updateViewport);
    return cleanup;
  }, []);

  const isMobile = viewport.width < BREAKPOINTS.md;
  const isTablet = viewport.width >= BREAKPOINTS.md && viewport.width < BREAKPOINTS.lg;
  const isDesktop = viewport.width >= BREAKPOINTS.lg;

  return {
    viewport,
    isMobile,
    isTablet,
    isDesktop
  };
};