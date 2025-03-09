
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const isMobile = useIsMobile();
  
  // Initialize from localStorage or default based on device size
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar-open');
      if (savedState !== null) {
        return savedState === 'true';
      }
    }
    return !isMobile; // Default state based on device size
  });

  // Update localStorage when isOpen changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-open', isOpen.toString());
    }
  }, [isOpen]);

  // Close sidebar by default on mobile or when screen becomes mobile-sized
  useEffect(() => {
    if (isMobile !== undefined) {
      setIsOpen(!isMobile);
    }
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};
