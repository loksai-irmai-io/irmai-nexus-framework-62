
import React from 'react';

interface SidebarLogoProps {
  isOpen: boolean;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ isOpen }) => {
  return (
    <div className="h-20 flex items-center justify-center px-4 border-b bg-sidebar">
      {isOpen ? (
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src="/lovable-uploads/f6af323e-8e1e-41cb-a223-30dc2436352c.png" 
            alt="IRMAI Logo" 
            className="h-12 object-contain" 
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src="/lovable-uploads/f6af323e-8e1e-41cb-a223-30dc2436352c.png" 
            alt="IRMAI Logo" 
            className="h-10 w-10 object-contain" 
          />
        </div>
      )}
    </div>
  );
};

export default SidebarLogo;

