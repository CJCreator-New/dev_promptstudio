import React, { useEffect, useRef, useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface ResponsiveChartProps {
  data: any[];
  renderChart: (container: HTMLElement, data: any[], config: ChartConfig) => void;
  className?: string;
}

interface ChartConfig {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  fontSize: number;
  showLabels: boolean;
  interactive: boolean;
}

export const ResponsiveChart: React.FC<ResponsiveChartProps> = ({ 
  data, 
  renderChart,
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useBreakpoint();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !dimensions.width) return;

    const config: ChartConfig = {
      width: dimensions.width,
      height: dimensions.height || (isMobile ? 250 : isTablet ? 350 : 450),
      margin: isMobile 
        ? { top: 10, right: 10, bottom: 30, left: 30 }
        : { top: 20, right: 20, bottom: 40, left: 50 },
      fontSize: isMobile ? 10 : 12,
      showLabels: !isMobile,
      interactive: !isMobile,
    };

    renderChart(containerRef.current, data, config);
  }, [data, dimensions, isMobile, isTablet, renderChart]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full ${isMobile ? 'h-64' : isTablet ? 'h-80' : 'h-96'} ${className}`}
    />
  );
};
