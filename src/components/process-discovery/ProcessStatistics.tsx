
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity, GitBranch, Clock, BarChart, Info } from 'lucide-react';

export const ProcessStatistics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">Activities</span>
            </div>
            <span className="font-medium">6</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">Decision Points</span>
            </div>
            <span className="font-medium">2</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">Avg. Process Duration</span>
            </div>
            <span className="font-medium">8m 20s</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BarChart className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">Cases Analyzed</span>
            </div>
            <span className="font-medium">1,253</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Info className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm">Variant Coverage</span>
            </div>
            <span className="font-medium">92%</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h4 className="text-sm font-medium mb-3">Process Performance</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Happy Path Rate</span>
                <span className="font-medium">72%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Automation Potential</span>
                <span className="font-medium">64%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Resource Utilization</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
