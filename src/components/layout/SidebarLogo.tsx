
import React from 'react';

interface SidebarLogoProps {
  isOpen: boolean;
  className?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ isOpen, className }) => {
  return (
    <div className={`h-20 flex items-center justify-center px-4 border-b bg-sidebar ${className || ''}`}>
      {isOpen ? (
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src="/lovable-uploads/e0e5366a-be2b-4f02-97cb-831a9e41477f.png" 
            alt="IRMAI Logo" 
            className="h-12 object-contain" 
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src="/lovable-uploads/e0e5366a-be2b-4f02-97cb-831a9e41477f.png" 
            alt="IRMAI Logo" 
            className="h-10 w-10 object-contain" 
          />
        </div>
      )}
    </div>
  );
};

export default SidebarLogo;
