
import { useState, useEffect } from 'react';
import { Layout as GridLayout } from 'react-grid-layout';

// Hook to manage draggable widget layouts
export const useDraggableLayout = (
  storageKey: string,
  defaultLayout: GridLayout[],
  cols: number = 12
) => {
  // Load layout from localStorage if available
  const [layout, setLayout] = useState<GridLayout[]>(() => {
    if (typeof window === 'undefined') return defaultLayout;
    
    try {
      const savedLayout = localStorage.getItem(storageKey);
      return savedLayout ? JSON.parse(savedLayout) : defaultLayout;
    } catch (e) {
      console.error('Error loading layout from localStorage:', e);
      return defaultLayout;
    }
  });

  // Save layout to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(layout));
    }
  }, [layout, storageKey]);

  // Handle layout changes
  const onLayoutChange = (newLayout: GridLayout[]) => {
    setLayout(newLayout);
  };

  // Reset to default layout
  const resetLayout = () => {
    setLayout(defaultLayout);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };

  return {
    layout,
    onLayoutChange,
    resetLayout,
    cols
  };
};

export default useDraggableLayout;
