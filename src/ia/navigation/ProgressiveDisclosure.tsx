import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DisclosureProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  level?: number;
  className?: string;
}

export const Disclosure: React.FC<DisclosureProps> = ({ 
  title, 
  children, 
  defaultOpen = false,
  level = 0,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`${className}`} style={{ paddingLeft: `${level * 1}rem` }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full py-2 text-left hover:text-accent-primary transition-colors"
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <span className="font-medium">{title}</span>
      </button>
      {isOpen && <div className="pl-6 py-2">{children}</div>}
    </div>
  );
};

interface AccordionProps {
  items: Array<{ id: string; title: string; content: ReactNode }>;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ 
  items, 
  allowMultiple = false,
  className = '' 
}) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds(prev => prev.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map(item => (
        <div key={item.id} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggle(item.id)}
            className="flex items-center justify-between w-full p-4 text-left hover:bg-elevated transition-colors"
            aria-expanded={openIds.includes(item.id)}
          >
            <span className="font-medium">{item.title}</span>
            {openIds.includes(item.id) ? 
              <ChevronDown className="w-5 h-5" /> : 
              <ChevronRight className="w-5 h-5" />
            }
          </button>
          {openIds.includes(item.id) && (
            <div className="p-4 border-t border-border bg-elevated">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
