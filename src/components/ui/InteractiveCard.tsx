import React, { useState } from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
  pressable?: boolean;
  selected?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  className = '',
  hoverable = true,
  pressable = true,
  selected = false
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (pressable) setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <div
      className={`
        bg-slate-900 border rounded-xl p-4 transition-all duration-200
        ${selected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-800'}
        ${hoverable ? 'hover:border-slate-700 hover:shadow-lg hover:-translate-y-0.5' : ''}
        ${pressable && isPressed ? 'scale-98' : 'scale-100'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  );
};

interface InteractiveListItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
  active?: boolean;
}

export const InteractiveListItem: React.FC<InteractiveListItemProps> = ({
  children,
  onClick,
  onDelete,
  className = '',
  active = false
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`
        group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-200 cursor-pointer
        ${active 
          ? 'bg-indigo-500/10 border border-indigo-500/30' 
          : 'hover:bg-slate-800/50 border border-transparent'
        }
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {children}
      
      {onDelete && showActions && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-all duration-150 animate-fade-in"
          aria-label="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
