import React, { useState, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

interface DropdownItem {
  label: string;
  description?: string;
  onClick: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = React.memo(({ 
  trigger, 
  items, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(dropdownRef, () => setIsOpen(false));
  
  const handleItemClick = (item: DropdownItem) => {
    item.onClick();
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1" role="menu">
            {items.map((item, index) => (
              <button 
                key={index}
                onClick={() => handleItemClick(item)}
                className="w-full text-left px-4 py-3 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-0 transition-colors group focus:bg-slate-700/50 outline-none"
                role="menuitem"
              >
                <span className="block text-xs font-bold text-indigo-400 mb-0.5 group-hover:text-indigo-300">
                  {item.label}
                </span>
                {item.description && (
                  <span className="block text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';