
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface RibbonNavProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const RibbonNav: React.FC<RibbonNavProps> = ({ children, className, style }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateArrows = () => {
    if (!scrollRef.current) return;
    
    setShowLeftArrow(scrollPosition > 0);
    setShowRightArrow(
      scrollRef.current.scrollWidth > scrollRef.current.clientWidth &&
      scrollPosition < scrollRef.current.scrollWidth - scrollRef.current.clientWidth
    );
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [scrollPosition]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = scrollRef.current.clientWidth / 2;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth,
          scrollPosition + scrollAmount
        );
    
    scrollRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  return (
    <div className={cn("relative", className)} style={style}>
      {showLeftArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden pb-2 pt-2 scroll-smooth"
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
      >
        {children}
      </div>
      
      {showRightArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default RibbonNav;
