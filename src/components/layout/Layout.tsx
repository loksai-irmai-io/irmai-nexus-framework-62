
import React from 'react';
import { cn } from '@/lib/utils';
import Header from './Header';
import Sidebar from './Sidebar';
import { SidebarProvider, useSidebarContext } from './SidebarProvider';

interface LayoutProps {
  children: React.ReactNode;
}

// Main content component that adjusts based on sidebar state
const MainContent: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { isOpen } = useSidebarContext();
  
  return (
    <main 
      className={cn(
        "flex-1 transition-all duration-300 animate-fade-in overflow-x-hidden pb-8",
        isOpen ? "pl-64" : "pl-16"
      )}
    >
      {children}
    </main>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
