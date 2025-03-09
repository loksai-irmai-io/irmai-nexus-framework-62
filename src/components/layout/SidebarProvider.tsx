
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
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
  
  // Toggle sidebar open/closed
  const toggleSidebar = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);

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

  // Add an event listener for hover on the sidebar area
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleSidebarHover = (e: MouseEvent) => {
      // Only trigger this if the sidebar is closed and mouse is on the far left
      if (!isOpen && e.clientX < 20) {
        setIsOpen(true);
      }
    };
    
    document.addEventListener('mousemove', handleSidebarHover);
    return () => document.removeEventListener('mousemove', handleSidebarHover);
  }, [isOpen]);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
