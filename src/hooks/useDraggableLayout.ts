
import { useState, useEffect, useCallback } from 'react';
import { Layout as GridLayout } from 'react-grid-layout';

// Type for hook options
interface DraggableLayoutOptions {
  storageKey: string;
  defaultLayout: GridLayout[];
  cols?: number;
  preventLocalStorage?: boolean;
}

// Hook to manage draggable widget layouts
export const useDraggableLayout = ({
  storageKey,
  defaultLayout,
  cols = 12,
  preventLocalStorage = false
}: DraggableLayoutOptions) => {
  // Load layout from localStorage if available and allowed
  const [layout, setLayout] = useState<GridLayout[]>(() => {
    if (typeof window === 'undefined' || preventLocalStorage) return defaultLayout;
    
    try {
      const savedLayout = localStorage.getItem(storageKey);
      if (!savedLayout) return defaultLayout;
      
      // Validate the stored layout before using it
      const parsedLayout = JSON.parse(savedLayout);
      if (!Array.isArray(parsedLayout)) {
        console.warn('Invalid layout format in localStorage');
        return defaultLayout;
      }
      
      // Validate each layout item has required properties
      const isValid = parsedLayout.every((item: any) => 
        typeof item === 'object' &&
        typeof item.i === 'string' &&
        typeof item.x === 'number' &&
        typeof item.y === 'number' &&
        typeof item.w === 'number' &&
        typeof item.h === 'number'
      );
      
      return isValid ? parsedLayout : defaultLayout;
    } catch (e) {
      console.error('Error loading layout from localStorage:', e);
      return defaultLayout;
    }
  });

  // Save layout to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !preventLocalStorage) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(layout));
      } catch (e) {
        console.error('Error saving layout to localStorage:', e);
      }
    }
  }, [layout, storageKey, preventLocalStorage]);

  // Handle layout changes
  const onLayoutChange = useCallback((newLayout: GridLayout[]) => {
    setLayout(newLayout);
  }, []);

  // Reset to default layout
  const resetLayout = useCallback(() => {
    setLayout(defaultLayout);
    if (typeof window !== 'undefined' && !preventLocalStorage) {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.error('Error removing layout from localStorage:', e);
      }
    }
  }, [defaultLayout, storageKey, preventLocalStorage]);

  return {
    layout,
    onLayoutChange,
    resetLayout,
    cols
  };
};

export default useDraggableLayout;
