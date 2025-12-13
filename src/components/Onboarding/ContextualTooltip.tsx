import React, { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';

interface ContextualTooltipProps {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  onDismiss: (id: string) => void;
}

export const ContextualTooltip: React.FC<ContextualTooltipProps> = ({
  id,
  target,
  title,
  content,
  placement = 'top',
  onDismiss
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = document.querySelector(target);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          const rect = element.getBoundingClientRect();
          
          let top = 0, left = 0;
          switch (placement) {
            case 'top':
              top = rect.top - 100;
              left = rect.left + rect.width / 2;
              break;
            case 'bottom':
              top = rect.bottom + 10;
              left = rect.left + rect.width / 2;
              break;
            case 'left':
              top = rect.top + rect.height / 2;
              left = rect.left - 270;
              break;
            case 'right':
              top = rect.top + rect.height / 2;
              left = rect.right + 10;
              break;
          }
          
          setPosition({ top, left });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, placement]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 bg-blue-600 text-white rounded-lg shadow-xl p-4 w-64 animate-in fade-in slide-in-from-bottom-2"
      style={{ top: `${position.top}px`, left: `${position.left}px`, transform: 'translateX(-50%)' }}
    >
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-white/90">{content}</p>
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="text-white/80 hover:text-white shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
