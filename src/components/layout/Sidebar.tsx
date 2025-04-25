
import React, { useEffect, useRef } from 'react';
import { useSidebarContext } from './SidebarProvider';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { mainMenuItems } from './data/menuItems';
import SidebarLogo from './SidebarLogo';
import SidebarMenuItem from './SidebarMenuItem';

const Sidebar: React.FC = () => {
  const { isOpen, setIsOpen } = useSidebarContext();
  const location = useLocation();
  const currentPath = location.pathname;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverZoneRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    const handleHover = () => {
      if (!isOpen) {
        setIsOpen(true);
      }
    };

    const hoverZone = hoverZoneRef.current;
    if (hoverZone) {
      hoverZone.addEventListener('mouseenter', handleHover);
      return () => {
        hoverZone.removeEventListener('mouseenter', handleHover);
      };
    }
  }, [isOpen, setIsOpen]);

  return (
    <>
      <div 
        ref={hoverZoneRef}
        className={cn(
          "fixed inset-y-0 left-0 w-4 z-20",
          isOpen && "hidden"
        )}
      />
      
      <aside 
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r shadow-lg transition-all duration-300 ease-in-out animate-fade-in bg-sidebar",
          isOpen ? "w-64" : "w-0 -translate-x-full sm:translate-x-0 sm:w-16"
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <SidebarLogo isOpen={isOpen} />
          <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
            {mainMenuItems.map((item) => {
              const isActive = currentPath === item.href || 
                             (item.href !== '/' && currentPath.startsWith(item.href));
              
              return (
                <SidebarMenuItem
                  key={item.id}
                  item={item}
                  isOpen={isOpen}
                  isActive={isActive}
                />
              );
            })}
          </nav>
          <div className="p-3 border-t">
            <div className="text-xs text-center text-muted-foreground py-2">
              {isOpen ? 'IRMAI v1.0.0' : 'v1'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

