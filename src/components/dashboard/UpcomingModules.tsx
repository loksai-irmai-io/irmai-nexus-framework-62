
import React from 'react';
import ModuleSummary from './ModuleSummary';
import { placeholderModuleData } from './data';

interface UpcomingModulesProps {
  isLoading: boolean;
}

const UpcomingModules: React.FC<UpcomingModulesProps> = ({ isLoading }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '1000ms' }}>
        Upcoming Modules
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '1100ms' }}>
        {placeholderModuleData.map(module => (
          <ModuleSummary 
            key={module.id} 
            data={{
              ...module,
              icon: (() => {
                // Convert string icon name to actual icon component that will be passed to ModuleSummary
                const icons = require('lucide-react');
                return module.icon && icons[module.icon] ? 
                  React.createElement(icons[module.icon], { className: "h-4 w-4" }) : 
                  null;
              })()
            }} 
            isLoading={isLoading} 
          />
        ))}
      </div>
    </>
  );
};

export default UpcomingModules;
