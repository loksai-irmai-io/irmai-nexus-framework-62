
import React, { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface DraggableWidgetProps {
  title: string;
  children: ReactNode;
  className?: string;
  dragEnabled?: boolean;
  onPositionChange?: (position: { x: number, y: number }) => void;
  defaultPosition?: { x: number, y: number };
  icon?: ReactNode;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  title,
  children,
  className,
  dragEnabled = false,
  onPositionChange,
  defaultPosition = { x: 0, y: 0 },
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  
  // Handler for when dragging starts
  const handleDragStart = (e: React.DragEvent) => {
    if (!dragEnabled) return;
    
    setIsDragging(true);
    // Store the initial mouse offset from the widget's top-left corner
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    // Store these offsets as data to use during drag
    e.dataTransfer.setData('text/plain', JSON.stringify({ offsetX, offsetY }));
  };
  
  // Handler for when dragging ends
  const handleDragEnd = (e: React.DragEvent) => {
    if (!dragEnabled) return;
    
    setIsDragging(false);
    e.preventDefault();
    
    // Get the stored offsets
    const offsetData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { offsetX, offsetY } = offsetData;
    
    // Calculate new position
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    
    // Update position
    setPosition({ x: newX, y: newY });
    if (onPositionChange) {
      onPositionChange({ x: newX, y: newY });
    }
  };
  
  // Prevent default to allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  return (
    <Card 
      className={cn(
        "transition-all duration-200 overflow-hidden",
        dragEnabled && "cursor-move absolute",
        isDragging && "opacity-50 z-50",
        className
      )}
      style={dragEnabled ? { 
        top: `${position.y}px`, 
        left: `${position.x}px`,
        zIndex: isDragging ? 50 : 10
      } : {}}
      draggable={dragEnabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <CardHeader className={cn(
        "drag-handle py-3 flex flex-row items-center",
        dragEnabled && "cursor-grab active:cursor-grabbing bg-muted/20"
      )}>
        {dragEnabled && <GripVertical className="h-4 w-4 mr-2 text-muted-foreground" />}
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export { DraggableWidget };
