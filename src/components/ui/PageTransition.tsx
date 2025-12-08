import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  duration?: number;
  delay?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const transitions = {
    fade: isVisible ? 'opacity-100' : 'opacity-0',
    'slide-up': isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
    'slide-down': isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
    scale: isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
  };

  return (
    <div
      className={`transition-all ${transitions[type]}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 50
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <PageTransition type="slide-up" delay={index * staggerDelay}>
          {child}
        </PageTransition>
      ))}
    </>
  );
};

interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  threshold = 0.1,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};
