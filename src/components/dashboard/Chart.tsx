import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Line, LineChart, Area, AreaChart, ComposedChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, ArrowDown, ArrowUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type ChartData = {
  [key: string]: string | number;
};

export type ChartDataSeries = {
  name: string;
  color: string;
  dataKey: string;
  yAxisId?: string;
  type?: string;
};

type CurveProps = {
  payload?: ChartData;
  name?: string;
  value?: number;
};

export interface ChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  series: ChartDataSeries[];
  type?: 'bar' | 'line' | 'pie' | 'area' | 'composed';
  xAxisKey?: string;
  stacked?: boolean;
  showLegend?: boolean;
  showPercentages?: boolean;
  showGrid?: boolean;
  height?: number;
  className?: string;
  tabs?: { title: string; data: ChartData[] }[];
  periods?: string[];
  tooltip?: string;
  isLoading?: boolean;
  onClick?: (datapoint: ChartData) => void;
  onMouseMove?: (data: any) => void;
  onMouseLeave?: () => void;
  emptyText?: string;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C',
  '#8884D8', '#82CA9D', '#FF6B6B', '#6A6AD5', '#FFA600'
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-2 text-xs">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <p>{entry.name}: <span className="font-medium">{entry.value}</span></p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const Chart: React.FC<ChartProps> = ({
  title,
  description,
  data,
  series,
  type = 'bar',
  xAxisKey = 'name',
  stacked = false,
  showLegend = true,
  showPercentages = false,
  showGrid = true,
  height = 300,
  className,
  tabs,
  periods,
  tooltip,
  isLoading = false,
  onClick,
  onMouseMove,
  onMouseLeave,
  emptyText = "No data available"
}) => {
  const [activeTab, setActiveTab] = useState(tabs ? tabs[0].title : null);
  const [activePeriodIndex, setActivePeriodIndex] = useState(periods ? 0 : null);
  
  const activeData = tabs 
    ? tabs.find(tab => tab.title === activeTab)?.data || data
    : data;
  
  const handlePeriodChange = (direction: 'prev' | 'next') => {
    if (!periods || periods.length <= 1) return;
    
    if (direction === 'prev') {
      setActivePeriodIndex(prev => (prev === 0 ? periods.length - 1 : prev - 1));
    } else {
      setActivePeriodIndex(prev => (prev === periods.length - 1 ? 0 : prev + 1));
    }
  };
  
  const handleDataClick = (data: any) => {
    if (!onClick) return;
    
    const payload = data.payload || data;
    if (payload && typeof payload === 'object') {
      onClick(payload as ChartData);
    }
  };
  
  const getChartHeight = (): number => {
    if (typeof height === 'number') {
      return height;
    }
    return 300;
  };
  
  const renderChart = () => {
    const actualHeight = getChartHeight();
    
    if (isLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
      );
    }
    
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={actualHeight}>
            <BarChart data={activeData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#eee" />}
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={value => showPercentages ? `${value}%` : value}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              {showLegend && <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />}
              {series.map((item, index) => (
                <Bar 
                  key={index}
                  dataKey={item.dataKey}
                  name={item.name}
                  fill={item.color || COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  stackId={stacked ? "stack" : undefined}
                  onClick={onClick ? handleDataClick : undefined}
                  cursor={onClick ? "pointer" : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={actualHeight}>
            <LineChart data={activeData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#eee" />}
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={value => showPercentages ? `${value}%` : value}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              {showLegend && <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />}
              {series.map((item, index) => (
                <Line 
                  key={index}
                  type="monotone"
                  dataKey={item.dataKey}
                  name={item.name}
                  stroke={item.color || COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  onClick={onClick ? handleDataClick : undefined}
                  cursor={onClick ? "pointer" : undefined}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        const pieHeight = actualHeight >= 300 ? actualHeight : Math.max(300, actualHeight + 50);
        
        return (
          <ResponsiveContainer width="100%" height={pieHeight}>
            <PieChart margin={{ top: 30, right: 30, bottom: 50, left: 30 }}>
              <Pie
                data={activeData}
                cx="50%"
                cy="40%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey={series[0].dataKey}
                nameKey={xAxisKey}
                label={({ percent }) => showPercentages ? `${(percent * 100).toFixed(0)}%` : ''}
                labelLine={false}
                onClick={onClick ? handleDataClick : undefined}
                cursor={onClick ? "pointer" : undefined}
              >
                {activeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={series[index]?.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value: any, name: any) => {
                  const total = activeData.reduce((acc: number, curr: any) => {
                    const val = Number(curr[series[0].dataKey]);
                    return acc + (isNaN(val) ? 0 : val);
                  }, 0);
                  
                  const percentage = total > 0 ? (Number(value) / total) * 100 : 0;
                  return showPercentages 
                    ? [`${value} (${percentage.toFixed(0)}%)`, name] 
                    : [value, name];
                }}
              />
              {showLegend && (
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ 
                    fontSize: '12px', 
                    paddingTop: '20px',
                    bottom: 0,
                    width: '90%',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={actualHeight}>
            <AreaChart data={activeData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#eee" />}
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={value => showPercentages ? `${value}%` : value}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              {showLegend && <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />}
              {series.map((item, index) => (
                <Area 
                  key={index}
                  type="monotone"
                  dataKey={item.dataKey}
                  name={item.name}
                  stroke={item.color || COLORS[index % COLORS.length]}
                  fill={item.color || COLORS[index % COLORS.length]}
                  fillOpacity={0.2}
                  stackId={stacked ? "stack" : undefined}
                  onClick={onClick ? handleDataClick : undefined}
                  cursor={onClick ? "pointer" : undefined}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={actualHeight}>
            <ComposedChart data={activeData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#eee" />}
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={value => showPercentages ? `${value}%` : value}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              {showLegend && <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />}
              {series.map((item, index) => {
                if (item.type === 'line') {
                  return (
                    <Line 
                      type="monotone"
                      key={index}
                      dataKey={item.dataKey}
                      name={item.name}
                      stroke={item.color || COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      onClick={onClick ? handleDataClick : undefined}
                      cursor={onClick ? "pointer" : undefined}
                    />
                  );
                } else {
                  return (
                    <Bar 
                      key={index}
                      dataKey={item.dataKey}
                      name={item.name}
                      fill={item.color || COLORS[index % COLORS.length]}
                      radius={[4, 4, 0, 0]}
                      stackId={stacked ? "stack" : undefined}
                      onClick={onClick ? handleDataClick : undefined}
                      cursor={onClick ? "pointer" : undefined}
                    />
                  );
                }
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={cn("rounded-lg border bg-card shadow-sm", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-card-foreground">{title}</h3>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          {periods && periods.length > 0 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handlePeriodChange('prev')}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {periods[activePeriodIndex || 0]}
              </span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handlePeriodChange('next')}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        
        {tabs && tabs.length > 0 && (
          <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-flow-col auto-cols-auto w-auto">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.title} value={tab.title}>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
      
      <div className="p-2 md:p-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default Chart;
