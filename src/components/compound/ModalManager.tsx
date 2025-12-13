import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react';

interface ModalContextValue {
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  isOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalManagerProps {
  children: ReactNode;
}

export const ModalManager: React.FC<ModalManagerProps> = ({ children }) => {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set());

  const openModal = useCallback((id: string) => {
    setOpenModals(prev => new Set(prev).add(id));
  }, []);

  const closeModal = useCallback((id: string) => {
    setOpenModals(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isOpen = useCallback((id: string) => openModals.has(id), [openModals]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalManager');
  }
  return context;
};
