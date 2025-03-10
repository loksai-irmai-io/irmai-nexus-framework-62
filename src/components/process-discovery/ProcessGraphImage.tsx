
import React, { useEffect, useRef } from 'react';
import { ProcessData } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProcessGraphImageProps {
  processData: ProcessData;
  width?: number;
  height?: number;
  isLoading?: boolean;
}

const ProcessGraphImage: React.FC<ProcessGraphImageProps> = ({
  processData,
  width = 800,
  height = 600,
  isLoading = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to draw the graph on canvas
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas || !processData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges first (so they appear behind nodes)
    processData.edges.forEach(edge => {
      const sourceNode = processData.nodes.find(node => node.id === edge.source);
      const targetNode = processData.nodes.find(node => node.id === edge.target);

      if (sourceNode && targetNode) {
        const sourceX = sourceNode.position.x;
        const sourceY = sourceNode.position.y;
        const targetX = targetNode.position.x;
        const targetY = targetNode.position.y;

        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw arrow head
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(
          targetX - arrowLength * Math.cos(angle - Math.PI / 6),
          targetY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          targetX - arrowLength * Math.cos(angle + Math.PI / 6),
          targetY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = '#94a3b8';
        ctx.fill();

        // Draw edge label if it exists
        if (edge.label) {
          const midX = (sourceX + targetX) / 2;
          const midY = (sourceY + targetY) / 2;
          ctx.font = '12px Arial';
          ctx.fillStyle = '#64748b';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.label, midX, midY - 10);
        }

        // Draw frequency if it exists
        if (edge.metrics?.frequency) {
          const midX = (sourceX + targetX) / 2;
          const midY = (sourceY + targetY) / 2;
          ctx.font = '10px Arial';
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`(${edge.metrics.frequency})`, midX, midY + 10);
        }
      }
    });

    // Draw nodes
    processData.nodes.forEach(node => {
      const { x, y } = node.position;
      const radius = node.type === 'gateway' ? 25 : 30;

      // Draw different shapes based on node type
      if (node.type === 'event') {
        // Circle for events
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = node.id === 'start' ? '#22c55e' : '#f43f5e';
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (node.type === 'gateway') {
        // Diamond for gateways
        ctx.beginPath();
        ctx.moveTo(x, y - radius);
        ctx.lineTo(x + radius, y);
        ctx.lineTo(x, y + radius);
        ctx.lineTo(x - radius, y);
        ctx.closePath();
        ctx.fillStyle = '#fcd34d';
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Rectangle for activities
        const width = 100;
        const height = 50;
        ctx.beginPath();
        ctx.roundRect(x - width / 2, y - height / 2, width, height, 5);
        
        // Color based on compliance
        ctx.fillStyle = node.compliant ? '#bfdbfe' : '#fecaca';
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw node label
      ctx.font = node.type === 'gateway' ? '10px Arial' : '12px Arial';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, x, y);

      // Draw metrics if they exist
      if (node.metrics) {
        const metricsText = node.metrics.frequency 
          ? `Freq: ${node.metrics.frequency}`
          : '';
        
        const durationText = node.metrics.avgDuration 
          ? `Avg: ${node.metrics.avgDuration}`
          : '';
        
        if (metricsText) {
          ctx.font = '10px Arial';
          ctx.fillStyle = '#64748b';
          ctx.fillText(metricsText, x, y + 25);
        }
        
        if (durationText) {
          ctx.font = '10px Arial';
          ctx.fillStyle = '#64748b';
          ctx.fillText(durationText, x, y + 40);
        }
      }
    });
  };

  // Draw the graph when processData changes
  useEffect(() => {
    if (!isLoading) {
      drawGraph();
    }
  }, [processData, isLoading]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-6" style={{ height: `${height}px` }}>
          <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
          <span className="ml-2 text-lg font-medium text-muted-foreground">Generating process graph...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-auto">
      <CardContent className="p-4">
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height} 
          className="border border-muted rounded-md"
        />
      </CardContent>
    </Card>
  );
};

export default ProcessGraphImage;
