
import React from 'react';
import { Network, GitBranch } from 'lucide-react';

interface ProcessViewSelectorProps {
  viewType: string;
}

const ProcessViewSelector: React.FC<ProcessViewSelectorProps> = ({ viewType }) => {
  if (viewType === 'petri') {
    return (
      <div className="relative w-full h-[500px] border border-muted rounded-md p-4 overflow-auto bg-muted/20">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Network className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Petri Net View</h3>
            <p className="text-muted-foreground max-w-md">
              This view shows the process as a Petri net, with places (states) and transitions (activities).
              It's useful for analyzing concurrency and synchronization in processes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (viewType === 'tree') {
    return (
      <div className="relative w-full h-[500px] border border-muted rounded-md p-4 overflow-auto bg-muted/20">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <GitBranch className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Process Tree View</h3>
            <p className="text-muted-foreground max-w-md">
              This hierarchical view represents the process as a tree, showing sequential, parallel, and choice constructs.
              It's useful for understanding the hierarchical structure of the process.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProcessViewSelector;
