
import React from 'react';
import InfoWidget, { InfoWidgetData } from '@/components/dashboard/InfoWidget';
import { useNavigate } from 'react-router-dom';

interface DashboardWidgetsProps {
  infoWidgetData: InfoWidgetData[];
  loading: boolean;
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ infoWidgetData, loading }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path.replace('/', ''));
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Risk Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {infoWidgetData.map((widget) => (
          <InfoWidget 
            key={widget.id}
            data={widget}
            onClick={() => handleNavigate(widget.actionHref)}
            isLoading={loading}
          />
        ))}
      </div>
    </>
  );
};

export default DashboardWidgets;
