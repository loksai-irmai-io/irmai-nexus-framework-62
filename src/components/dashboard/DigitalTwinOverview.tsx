
import React from 'react';
import KnowledgeGraph from './KnowledgeGraph';

const DigitalTwinOverview: React.FC = () => {
  return (
    <div className="mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">Digital Twin Overview</h2>
      <div className="p-1 border border-primary/20 rounded-lg bg-primary/5">
        <KnowledgeGraph className="h-[400px] rounded-lg" />
      </div>
      <p className="text-sm text-muted-foreground mt-2 italic">
        This is your central data hub – all insights and interdependencies are sourced here.
      </p>
    </div>
  );
};

export default DigitalTwinOverview;
